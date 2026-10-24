import { test } from "node:test";
import assert from "node:assert/strict";
import { availableQuantity, BOOKING_HOURS, createReservationStore, localDate, MESSAGES_KEY, RESERVATIONS_KEY, validateSlot } from "../src/utils/reservations.js";
import { INITIAL_PRODUCTS } from "../src/data/products.js";
import { memoryStorage } from "./helpers.js";

const user = { id: "vecino-1", nombre: "Ana", apellidos: "Pérez", role: "user" };
const order = (overrides = {}) => ({ user, items: [{ id: 1, quantity: 1 }], date: "2030-01-02", time: "10:00", ...overrides });
function fixture(storage = memoryStorage()) {
  let sequence = 0;
  const options = { now: () => new Date("2030-01-01T07:00:00"), uuid: () => `reserva-${++sequence}` };
  return { storage, options, store: createReservationStore(storage, options) };
}

test("horarios cubren bloques completos de 08:00 a 21:00", () => {
  assert.equal(BOOKING_HOURS.length, 14);
  assert.equal(BOOKING_HOURS[0], "08:00");
  assert.equal(BOOKING_HOURS.at(-1), "21:00");
});
test("fecha local conserva el día del calendario del navegador", () => {
  assert.equal(localDate(new Date(2030, 0, 2, 23, 30)), "2030-01-02");
});
test("horarios pasados, fechas imposibles y horas fuera de bloques se rechazan", () => {
  const now = new Date("2030-01-01T10:30:00");
  for (const [date, time] of [["2030-01-01", "10:00"], ["2029-12-31", "12:00"], ["2030-02-31", "12:00"], ["2030-01-02", "22:00"], ["2030-01-02", "10:30"], ["", ""]]) {
    assert.throws(() => validateSlot(date, time, now));
  }
  assert.ok(validateSlot("2030-01-01", "11:00", now) > now);
});
test("crear reserva exige sesión y artículos", () => {
  const { store } = fixture();
  assert.throws(() => store.create(order({ user: null })), /sesión/);
  assert.throws(() => store.create(order({ items: [] })), /producto/);
});
test("reserva guarda detalle, descuento y total sin cobrar ni inventar correo enviado", () => {
  const { store, storage, options } = fixture();
  const booking = store.create(order({ coupon: "SANMIGUEL", items: [{ id: 1, quantity: 1, precio: 1 }] }));
  assert.equal(booking.total, 31500);
  assert.equal(booking.subtotal, 35000);
  assert.equal(booking.discount, 3500);
  assert.equal(booking.items[0].precio, 35000);
  assert.equal(booking.durationMinutes, 60);
  assert.equal(booking.paymentStatus, "sin_cobro_demo");
  assert.equal(booking.status, "confirmada");
  assert.equal(createReservationStore(storage, options).list()[0].id, booking.id);
});
test("una cancha ocupada no se reserva dos veces en el mismo bloque", () => {
  const { store } = fixture();
  store.create(order());
  assert.throws(() => store.create(order({ user: { ...user, id: "vecino-2" } })), /disponibilidad/);
  assert.equal(store.list().length, 1);
});
test("la misma cancha puede reservarse en otra fecha u hora", () => {
  const { store } = fixture();
  store.create(order());
  store.create(order({ time: "11:00" }));
  store.create(order({ date: "2030-01-03" }));
  assert.equal(store.list().length, 3);
});
test("disponibilidad de implementos descuenta cantidades de todas las reservas activas", () => {
  const { store } = fixture();
  store.create(order({ items: [{ id: 4, quantity: 6 }] }));
  assert.equal(availableQuantity(INITIAL_PRODUCTS[3], "2030-01-02", "10:00", store.list()), 4);
  store.create(order({ items: [{ id: 4, quantity: 4 }] }));
  assert.throws(() => store.create(order({ items: [{ id: 4, quantity: 1 }] })), /disponibilidad/);
});
test("cancelar libera la cancha y conserva el historial", () => {
  const { store } = fixture();
  const booking = store.create(order());
  assert.equal(store.cancel(booking.id, user).status, "cancelada");
  assert.equal(availableQuantity(INITIAL_PRODUCTS[0], "2030-01-02", "10:00", store.list()), 1);
  store.create(order());
  assert.equal(store.list().length, 2);
});
test("otra cuenta no cancela reservas ajenas; un administrador sí", () => {
  const { store } = fixture();
  const booking = store.create(order());
  assert.throws(() => store.cancel(booking.id, { id: "otro", role: "user" }), /permiso/);
  assert.equal(store.cancel(booking.id, { id: "admin", role: "admin" }).status, "cancelada");
});
test("no permite cancelar reservas inexistentes, vencidas ni ya canceladas", () => {
  const { store, storage } = fixture();
  assert.throws(() => store.cancel("inexistente", user));
  const booking = store.create(order());
  store.cancel(booking.id, user);
  assert.throws(() => store.cancel(booking.id, user), /ya está cancelada/);
  const next = store.create(order());
  const later = createReservationStore(storage, { now: () => new Date("2030-01-03T12:00:00") });
  assert.throws(() => later.cancel(next.id, user), /futuro/);
});
test("historial dañado no se borra al intentar reservar", () => {
  const { store, storage } = fixture(memoryStorage({ [RESERVATIONS_KEY]: "null" }));
  assert.throws(() => store.create(order()), /inválido/);
  assert.equal(storage.getItem(RESERVATIONS_KEY), "null");
});
test("si falla el guardado de una reserva no se anuncia éxito", () => {
  const { store, storage } = fixture();
  storage.setItem = () => { throw new Error("sin espacio"); };
  assert.throws(() => store.create(order()), /guardar/);
  assert.equal(store.list().length, 0);
});
test("consulta se valida, normaliza y persiste sin envío externo", () => {
  const { store, storage, options } = fixture();
  const message = store.saveMessage({ nombre: " Ana Pérez ", correo: " ANA@EXAMPLE.COM ", comentario: " Consulta de prueba " });
  assert.equal(message.nombre, "Ana Pérez");
  assert.equal(message.correo, "ana@example.com");
  assert.equal(message.comentario, "Consulta de prueba");
  assert.equal(message.status, "guardada_localmente");
  assert.equal(createReservationStore(storage, options).listMessages()[0].id, message.id);
});
test("consultas vacías, correo inválido o texto excesivo no se guardan", () => {
  const { store } = fixture();
  const valid = { nombre: "Ana", correo: "ana@example.com", comentario: "Hola" };
  for (const overrides of [{ nombre: "123" }, { correo: "invalido" }, { comentario: " " }, { comentario: "x".repeat(2001) }]) {
    assert.throws(() => store.saveMessage({ ...valid, ...overrides }));
  }
  assert.equal(store.listMessages().length, 0);
});
test("consultas dañadas no se sobrescriben", () => {
  const { store, storage } = fixture(memoryStorage({ [MESSAGES_KEY]: "{}" }));
  assert.throws(() => store.saveMessage({ nombre: "Ana", correo: "ana@example.com", comentario: "Hola" }));
  assert.equal(storage.getItem(MESSAGES_KEY), "{}");
});
