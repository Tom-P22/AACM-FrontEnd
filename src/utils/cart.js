import { INITIAL_PRODUCTS } from "../data/products.js";
import { readJson, writeJson } from "./storage.js";

export const CART_KEY = "cart_deportes_v1";
export const VALID_COUPON = "SANMIGUEL";
export const emptyCart = () => ({ items: [], coupon: "", date: "", time: "" });
export const capacity = (product) => product.categoria === "Canchas" ? 1 : 10;

export function catalogProduct(id, products = INITIAL_PRODUCTS) {
  const product = products.find((item) => item.id === id && item.active !== false);
  if (!product) throw new Error("El producto no existe en el catálogo.");
  return product;
}

export function normalizeItems(items, products = INITIAL_PRODUCTS) {
  if (!Array.isArray(items)) throw new Error("El carrito guardado no tiene un formato válido.");
  const ids = new Set();
  return items.map((item) => {
    const product = catalogProduct(item?.id, products);
    if (ids.has(product.id)) throw new Error("El carrito contiene productos duplicados.");
    ids.add(product.id);
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > capacity(product)) {
      throw new Error(`La cantidad de ${product.nombre} debe estar entre 1 y ${capacity(product)}.`);
    }
    // El precio se obtiene del catálogo, nunca de los datos recibidos.
    return { ...product, quantity: item.quantity };
  });
}

export function calculateTotals(items, coupon = "", products = INITIAL_PRODUCTS) {
  const canonical = normalizeItems(items, products);
  const subtotal = canonical.reduce((sum, item) => sum + item.precio * item.quantity, 0);
  const discount = coupon === VALID_COUPON ? Math.round(subtotal * 0.1) : 0;
  return { subtotal, discount, total: subtotal - discount, totalItems: canonical.reduce((sum, item) => sum + item.quantity, 0) };
}

export function changeQuantity(items, id, quantity, products = INITIAL_PRODUCTS) {
  const product = catalogProduct(id, products);
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > capacity(product)) {
    throw new Error(`La cantidad máxima es ${capacity(product)}; usa un número entero.`);
  }
  const next = normalizeItems(items, products).filter((item) => item.id !== id);
  if (quantity > 0) next.push({ ...product, quantity });
  return next;
}

export function reconcileItems(items, products) {
  return items.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.id && entry.active !== false);
    return product ? [{ ...product, quantity: Math.min(item.quantity, capacity(product)) }] : [];
  });
}

export function createCartStore(storage, getProducts = () => INITIAL_PRODUCTS) {
  const load = () => {
    const saved = readJson(storage, CART_KEY, emptyCart());
    if (!saved || typeof saved !== "object" || typeof saved.date !== "string" || typeof saved.time !== "string") {
      throw new Error("El carrito guardado está dañado. Puedes restablecerlo con Vaciar carrito.");
    }
    const products = getProducts();
    if (!Array.isArray(saved.items)) throw new Error("El carrito guardado no tiene un formato válido.");
    // Retirar productos archivados sin romper el carrito ni el historial de reservas.
    const available = saved.items.filter((item) => !products.some((product) => product.id === item?.id && product.active === false));
    return { items: normalizeItems(available, products), coupon: saved.coupon === VALID_COUPON ? VALID_COUPON : "", date: saved.date, time: saved.time };
  };
  const save = (next) => {
    writeJson(storage, CART_KEY, { ...next, items: next.items.map(({ id, quantity }) => ({ id, quantity })) });
    return next;
  };
  return {
    load,
    setQuantity(id, quantity) { const prev = load(); return save({ ...prev, items: changeQuantity(prev.items, id, quantity, getProducts()) }); },
    add(id) {
      const prev = load();
      const quantity = (prev.items.find((item) => item.id === id)?.quantity || 0) + 1;
      return save({ ...prev, items: changeQuantity(prev.items, id, quantity, getProducts()) });
    },
    clear() { return save(emptyCart()); },
    applyCoupon(code) {
      const coupon = typeof code === "string" ? code.trim().toUpperCase() : "";
      return save({ ...load(), coupon: coupon === VALID_COUPON ? coupon : "" });
    },
    setSchedule(date, time) {
      if (typeof date !== "string" || typeof time !== "string") throw new Error("Selecciona una fecha y una hora.");
      return save({ ...load(), date, time });
    },
  };
}
