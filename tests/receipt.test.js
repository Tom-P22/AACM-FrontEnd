import { test } from "vitest";
import assert from "node:assert/strict";
import { reservationReceipt } from "../src/utils/receipt.js";
test("comprobante usa precios históricos y conserva el total con descuento", () => {
  const receipt = reservationReceipt({ id: "reserva", total: 58500, items: [{ id: 1, precio: 35000, quantity: 1 }, { id: 4, precio: 15000, quantity: 2 }] });
  assert.equal(receipt.subtotal, 65000); assert.equal(receipt.discount, 6500); assert.equal(receipt.total, 58500); assert.equal(receipt.items[1].lineTotal, 30000);
});
test("comprobante rechaza valores no numéricos y cantidades inválidas", () => {
  assert.throws(() => reservationReceipt({ total: 10, items: [{ precio: "10", quantity: 1 }] }));
  assert.throws(() => reservationReceipt({ total: 10, items: [{ precio: 10, quantity: 0 }] }));
});
