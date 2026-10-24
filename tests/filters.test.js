import { test } from "node:test";
import assert from "node:assert/strict";
import { filterReservations, matchesQuery } from "../src/utils/filters.js";
test("búsqueda ignora mayúsculas y tildes", () => {
  assert.equal(matchesQuery(" futbol ", ["Cancha de Fútbol"]), true);
  assert.equal(matchesQuery("tenis", ["Balón de básquetbol"]), false);
});
test("filtros de reserva combinan vecino, fecha, estado y productos", () => {
  const records = [{ id: "abc-1", customerName: "José Pérez", date: "2030-01-02", status: "confirmada", items: [{ nombre: "Cancha Fútbol" }] }, { id: "abc-2", customerName: "Ana", date: "2030-01-03", status: "cancelada", items: [{ nombre: "Tenis" }] }];
  assert.equal(filterReservations(records, { query: "jose", date: "2030-01-02", status: "confirmada" }).length, 1);
  assert.equal(filterReservations(records, { query: "futbol" }).length, 1);
  assert.equal(filterReservations(records, { date: "2030-01-02", status: "cancelada" }).length, 0);
  assert.equal(filterReservations(records).length, 2);
});
