import { test } from "vitest";
import assert from "node:assert/strict";
import { createReservationStore } from "../src/utils/reservations.js";
import { filterMessages } from "../src/utils/filters.js";
import { memoryStorage } from "./helpers.js";

test("administrador cambia estados y se conservan al recargar", () => {
  const storage = memoryStorage(); const store = createReservationStore(storage, { uuid: () => "consulta-1" });
  store.saveMessage({ nombre: "José Pérez", correo: "jose@gmail.com", comentario: "Necesito información de una cancha" });
  assert.equal(store.updateMessageStatus("consulta-1", "en_revision", { role: "admin" }).status, "en_revision");
  store.updateMessageStatus("consulta-1", "atendida", { role: "admin" });
  assert.equal(createReservationStore(storage).listMessages()[0].status, "atendida");
  assert.equal(filterMessages(store.listMessages(), { query: "jose", status: "atendida" }).length, 1);
  assert.equal(filterMessages(store.listMessages(), { status: "pendiente" }).length, 0);
});
test("usuarios y editores no cambian estados y se rechazan estados inválidos", () => {
  const store = createReservationStore(memoryStorage());
  for (const role of ["user", "editor"]) assert.throws(() => store.updateMessageStatus("1", "atendida", { role }), /permiso/);
  assert.throws(() => store.updateMessageStatus("1", "__proto__", { role: "admin" }), /estado/);
  assert.throws(() => store.updateMessageStatus("1", "atendida", { role: "admin" }), /existe/);
});
test("consultas anteriores se presentan como pendientes sin perder su texto", () => {
  const storage = memoryStorage({ messages_deportes_v1: JSON.stringify([{ id: "antigua", nombre: "Ana", correo: "ana@gmail.com", comentario: "Texto original", createdAt: "2026-10-24T12:00:00Z", status: "guardada_localmente" }]) });
  const record = createReservationStore(storage).listMessages()[0];
  assert.equal(record.status, "pendiente"); assert.equal(record.comentario, "Texto original");
});
