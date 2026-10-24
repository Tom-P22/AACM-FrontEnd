import { test } from "node:test";
import assert from "node:assert/strict";
import { capacity, minimumRequiredStock } from "../src/utils/inventory.js";
import { createContentStore } from "../src/utils/content.js";
import { createCartStore } from "../src/utils/cart.js";
import { availableQuantity } from "../src/utils/reservations.js";
import { memoryStorage } from "./helpers.js";

test("stock configurable conserva valores anteriores y admite agotados", () => {
  assert.equal(capacity({ categoria: "Canchas" }), 1); assert.equal(capacity({ categoria: "Implementos" }), 10);
  assert.equal(capacity({ categoria: "Implementos", stock: 0 }), 0); assert.equal(capacity({ stock: 25 }), 25);
});
test("el mínimo de stock suma reservas por horario y descarta canceladas", () => {
  const reservations = [3, 2].map((quantity) => ({ status: "confirmada", date: "2030-01-02", time: "10:00", items: [{ id: 4, quantity }] }));
  reservations.push({ ...reservations[0], status: "cancelada" });
  assert.equal(minimumRequiredStock(reservations, 4, new Date("2030-01-01")), 5);
  assert.equal(availableQuantity({ id: 4, stock: 8 }, "2030-01-02", "10:00", reservations), 3);
});
test("no se reduce stock por debajo de las reservas confirmadas", () => {
  const storage = memoryStorage({ reservations_deportes_v1: JSON.stringify([{ status: "confirmada", date: "2030-01-02", time: "10:00", items: [{ id: 4, quantity: 5 }] }]) });
  const content = createContentStore(storage, { now: () => new Date("2030-01-01") }); const original = content.load().products[3];
  assert.throws(() => content.saveProduct({ role: "admin" }, { ...original, stock: 4 }), /comprometidas/);
  assert.equal(content.saveProduct({ role: "admin" }, { ...original, stock: 5 }).products[3].stock, 5);
});
test("cambios de stock ajustan cantidades y retiran agotados del carrito", () => {
  const storage = memoryStorage(); const content = createContentStore(storage); const cart = createCartStore(storage, () => content.load().products);
  cart.setQuantity(4, 8); const original = content.load().products[3];
  content.saveProduct({ role: "admin" }, { ...original, stock: 3 }); assert.equal(cart.load().items[0].quantity, 3);
  content.saveProduct({ role: "admin" }, { ...original, stock: 0 }); assert.equal(cart.load().items.length, 0);
});
test("stock negativo, fraccionario o superior a la capacidad de una cancha se rechaza", () => {
  const store = createContentStore(memoryStorage()); const product = store.load().products[0];
  for (const stock of [-1, 0.5, 2, NaN]) assert.throws(() => store.saveProduct({ role: "admin" }, { ...product, stock }));
});
