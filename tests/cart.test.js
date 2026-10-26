import { test } from "vitest";
import assert from "node:assert/strict";
import { calculateTotals, capacity, CART_KEY, changeQuantity, createCartStore, normalizeItems } from "../src/utils/cart.js";
import { INITIAL_PRODUCTS } from "../src/data/products.js";
import { memoryStorage } from "./helpers.js";

test("carrito vacío tiene subtotales, descuentos y cantidades en cero", () => {
  assert.deepEqual(calculateTotals([]), { subtotal: 0, discount: 0, total: 0, totalItems: 0 });
});
test("totaliza precios y cantidades de distintos productos", () => {
  assert.deepEqual(calculateTotals([{ id: 1, quantity: 1 }, { id: 4, quantity: 2 }]), { subtotal: 65000, discount: 0, total: 65000, totalItems: 3 });
});
test("cupón válido aplica 10% una sola vez y un cupón desconocido no descuenta", () => {
  const items = [{ id: 1, quantity: 1 }];
  assert.equal(calculateTotals(items, "SANMIGUEL").total, 31500);
  assert.equal(calculateTotals(items, "OTRO").total, 35000);
});
test("precios alterados en los artículos se reemplazan por el catálogo", () => {
  assert.equal(calculateTotals([{ id: 1, quantity: 1, precio: 1 }]).subtotal, 35000);
});
test("agrega y cambia cantidad sin duplicar productos", () => {
  const items = changeQuantity(changeQuantity([], 4, 1), 4, 3);
  assert.equal(items.length, 1);
  assert.equal(items[0].quantity, 3);
});
test("cantidad cero elimina un artículo y conserva los demás", () => {
  const items = changeQuantity([{ id: 1, quantity: 1 }, { id: 4, quantity: 2 }], 4, 0);
  assert.deepEqual(items.map((item) => item.id), [1]);
});
test("cantidades negativas, fraccionarias, no numéricas y excesivas se rechazan", () => {
  for (const quantity of [-1, 1.5, NaN, Infinity, "2", 11]) assert.throws(() => changeQuantity([], 4, quantity));
});
test("cada cancha admite una unidad por bloque", () => {
  assert.equal(capacity(INITIAL_PRODUCTS[0]), 1);
  assert.throws(() => changeQuantity([], 1, 2));
});
test("implementos admiten hasta diez unidades por bloque", () => {
  assert.equal(changeQuantity([], 4, 10)[0].quantity, 10);
  assert.throws(() => changeQuantity([], 4, 11));
});
test("catálogo desconocido y productos repetidos no ingresan al carrito", () => {
  assert.throws(() => normalizeItems([{ id: 999, quantity: 1 }]));
  assert.throws(() => normalizeItems([{ id: 1, quantity: 1 }, { id: 1, quantity: 1 }]));
  assert.throws(() => normalizeItems([null]));
});
test("carrito, cupón y horario sobreviven una nueva instancia del almacenamiento", () => {
  const storage = memoryStorage();
  const store = createCartStore(storage);
  store.add(4);
  store.add(4);
  store.applyCoupon(" sanmiguel ");
  store.setSchedule("2030-01-02", "10:00");
  const restored = createCartStore(storage).load();
  assert.equal(restored.items[0].quantity, 2);
  assert.equal(restored.coupon, "SANMIGUEL");
  assert.equal(restored.date, "2030-01-02");
  assert.equal(restored.time, "10:00");
  assert.deepEqual(JSON.parse(storage.getItem(CART_KEY)).items, [{ id: 4, quantity: 2 }]);
});
test("cupón inválido retira el descuento anterior", () => {
  const store = createCartStore(memoryStorage());
  store.applyCoupon("SANMIGUEL");
  assert.equal(store.applyCoupon("invalido").coupon, "");
});
test("vaciar carrito elimina artículos, descuento y horario", () => {
  const store = createCartStore(memoryStorage());
  store.add(1);
  store.applyCoupon("SANMIGUEL");
  store.setSchedule("2030-01-02", "10:00");
  assert.deepEqual(store.clear(), { items: [], coupon: "", date: "", time: "" });
});
test("carrito dañado informa el error sin sobrescribirlo y permite restablecerlo", () => {
  const storage = memoryStorage({ [CART_KEY]: "{dañado" });
  const store = createCartStore(storage);
  assert.throws(() => store.load());
  assert.throws(() => store.add(1));
  assert.equal(storage.getItem(CART_KEY), "{dañado");
  store.clear();
  assert.equal(store.load().items.length, 0);
});
test("fallo al persistir no devuelve un carrito guardado exitosamente", () => {
  const storage = memoryStorage();
  storage.setItem = () => { throw new Error("sin espacio"); };
  assert.throws(() => createCartStore(storage).add(1), /guardar/);
});
