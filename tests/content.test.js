import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTENT_KEY, createContentStore } from "../src/utils/content.js";
import { createCartStore } from "../src/utils/cart.js";
import { createReservationStore } from "../src/utils/reservations.js";
import { memoryStorage } from "./helpers.js";

const admin = { id: "admin", role: "admin" };
const editor = { id: "editor", role: "editor" };
const user = { id: "user", role: "user" };
const product = { nombre: "Balón de básquetbol", categoria: "Implementos", precio: 12500, descripcion: "Balón para entrenamiento deportivo.", imagen: "/img/Basketball.jpg" };
const news = { titulo: "Nueva jornada deportiva", categoria: "Comunidad", texto: "Invitamos a los vecinos a una jornada deportiva.", imagen: "/img/TallerFutbol.jpg", fecha: "2026-10-24" };

test("contenido inicial contiene el catálogo y las noticias existentes", () => {
  const state = createContentStore(memoryStorage()).load();
  assert.equal(state.products.length, 6);
  assert.equal(state.news.length, 3);
});
test("administrador agrega producto persistente y con ID único", () => {
  const storage = memoryStorage();
  const store = createContentStore(storage);
  const state = store.saveProduct(admin, product);
  assert.equal(state.products.length, 7);
  assert.equal(new Set(state.products.map((item) => item.id)).size, 7);
  assert.equal(createContentStore(storage).load().products.at(-1).nombre, product.nombre);
});
test("usuario y editor no pueden agregar ni editar ni archivar productos", () => {
  const store = createContentStore(memoryStorage());
  for (const actor of [user, editor, null]) {
    assert.throws(() => store.saveProduct(actor, product), /permiso/);
    assert.throws(() => store.saveProduct(actor, { ...product, id: 1 }), /permiso/);
    assert.throws(() => store.toggleProduct(actor, 1), /permiso/);
  }
});
test("editor puede publicar noticias, usuario normal no", () => {
  const store = createContentStore(memoryStorage());
  assert.equal(store.saveNews(editor, news).news.length, 4);
  assert.throws(() => store.saveNews(user, news), /permiso/);
  assert.throws(() => store.toggleNews(user, 1), /permiso/);
});
test("editar no duplica registros y archivar/restaurar conserva su información", () => {
  const store = createContentStore(memoryStorage());
  const created = store.saveNews(admin, news).news.at(-1);
  const state = store.saveNews(editor, { ...created, titulo: "Jornada deportiva actualizada" });
  assert.equal(state.news.length, 4);
  assert.equal(state.news.at(-1).titulo, "Jornada deportiva actualizada");
  assert.equal(store.toggleNews(editor, created.id).news.at(-1).active, false);
  assert.equal(store.toggleNews(editor, created.id).news.at(-1).active, true);
});
test("productos rechazan precio inválido, texto insuficiente e imágenes desconocidas", () => {
  const store = createContentStore(memoryStorage());
  for (const invalid of [{ precio: 0 }, { precio: -1 }, { precio: 1.5 }, { precio: NaN }, { nombre: "" }, { descripcion: "corta" }, { imagen: "javascript:alert(1)" }, { categoria: "Otra" }]) {
    assert.throws(() => store.saveProduct(admin, { ...product, ...invalid }));
  }
});
test("noticias rechazan fecha imposible, categoría y contenido inválidos", () => {
  const store = createContentStore(memoryStorage());
  for (const invalid of [{ fecha: "2026-02-31" }, { categoria: "__proto__" }, { texto: "corto" }, { titulo: "" }]) {
    assert.throws(() => store.saveNews(editor, { ...news, ...invalid }));
  }
});
test("nombres y títulos duplicados se rechazan y no se cambian categorías existentes", () => {
  const store = createContentStore(memoryStorage());
  store.saveProduct(admin, product);
  assert.throws(() => store.saveProduct(admin, { ...product, nombre: product.nombre.toUpperCase() }), /existe/);
  const existing = store.load().products[0];
  assert.throws(() => store.saveProduct(admin, { ...existing, categoria: "Implementos" }), /categoría/);
  store.saveNews(editor, news);
  assert.throws(() => store.saveNews(editor, news), /existe/);
});
test("nuevo producto se puede agregar al carrito y reservar con su precio del catálogo", () => {
  const storage = memoryStorage();
  const content = createContentStore(storage);
  const created = content.saveProduct(admin, product).products.at(-1);
  const getProducts = () => content.load().products;
  const cart = createCartStore(storage, getProducts);
  cart.add(created.id);
  const bookings = createReservationStore(storage, { getProducts, now: () => new Date("2030-01-01T07:00:00"), uuid: () => "nueva-reserva" });
  const booking = bookings.create({ user, items: [{ id: created.id, quantity: 1, precio: 1 }], date: "2030-01-02", time: "10:00" });
  assert.equal(booking.total, 12500);
  content.saveProduct(admin, { ...created, precio: 15000 });
  assert.equal(cart.load().items[0].precio, 15000);
  assert.equal(bookings.list()[0].total, 12500);
});
test("archivar producto lo retira del carrito y no borra reservas anteriores", () => {
  const storage = memoryStorage();
  const content = createContentStore(storage);
  const getProducts = () => content.load().products;
  const cart = createCartStore(storage, getProducts);
  cart.add(1);
  const bookings = createReservationStore(storage, { getProducts, now: () => new Date("2030-01-01T07:00:00"), uuid: () => "reserva-previa" });
  bookings.create({ user, items: cart.load().items, date: "2030-01-02", time: "10:00" });
  content.toggleProduct(admin, 1);
  assert.equal(cart.load().items.length, 0);
  assert.equal(bookings.list().length, 1);
  assert.throws(() => cart.add(1), /catálogo/);
});
test("contenido dañado y fallos de escritura no se sobrescriben ni anuncian éxito", () => {
  const storage = memoryStorage({ [CONTENT_KEY]: "null" });
  assert.throws(() => createContentStore(storage).saveProduct(admin, product));
  assert.equal(storage.getItem(CONTENT_KEY), "null");
  const full = memoryStorage();
  full.setItem = () => { throw new Error("quota"); };
  assert.throws(() => createContentStore(full).saveNews(editor, news), /guardar/);
});
