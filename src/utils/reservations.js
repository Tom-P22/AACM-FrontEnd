import { calculateTotals, capacity, normalizeItems, VALID_COUPON } from "./cart.js";
import { readJson, writeJson } from "./storage.js";
import { validarNombre } from "./validations.js";
import { INITIAL_PRODUCTS } from "../data/products.js";

export const RESERVATIONS_KEY = "reservations_deportes_v1";
export const MESSAGES_KEY = "messages_deportes_v1";
export const BOOKING_HOURS = Array.from({ length: 14 }, (_, index) => `${String(index + 8).padStart(2, "0")}:00`);

export function localDate(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

export function validateSlot(date, time, now = new Date()) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !BOOKING_HOURS.includes(time)) {
    throw new Error("Selecciona una fecha y un horario entre 08:00 y 21:00.");
  }
  const start = new Date(`${date}T${time}:00`);
  if (Number.isNaN(start.getTime()) || localDate(start) !== date) throw new Error("La fecha seleccionada no existe.");
  if (start <= now) throw new Error("Selecciona un horario futuro.");
  return start;
}

export function availableQuantity(product, date, time, reservations) {
  const reserved = reservations.filter((booking) => booking.status === "confirmada" && booking.date === date && booking.time === time)
    .reduce((sum, booking) => sum + booking.items.filter((item) => item.id === product.id).reduce((total, item) => total + item.quantity, 0), 0);
  return Math.max(0, capacity(product) - reserved);
}

export function createReservationStore(storage, { now = () => new Date(), uuid = () => globalThis.crypto.randomUUID(), getProducts = () => INITIAL_PRODUCTS } = {}) {
  const list = () => {
    const saved = readJson(storage, RESERVATIONS_KEY, []);
    if (!Array.isArray(saved) || saved.some((item) =>
      !item || typeof item.id !== "string" || !["string", "number"].includes(typeof item.userId) ||
      typeof item.customerName !== "string" || typeof item.date !== "string" || !BOOKING_HOURS.includes(item.time) ||
      !["confirmada", "cancelada"].includes(item.status) || !Number.isFinite(item.total) || item.total < 0 ||
      !Array.isArray(item.items) || item.items.length === 0 || item.items.some((product) =>
        !product || !Number.isInteger(product.id) || typeof product.nombre !== "string" ||
        !Number.isInteger(product.quantity) || product.quantity < 1 || !Number.isFinite(product.precio) || product.precio < 0)
    )) throw new Error("El historial guardado tiene un formato inválido. No se sobrescribieron tus reservas.");
    return saved;
  };
  const listMessages = () => {
    const saved = readJson(storage, MESSAGES_KEY, []);
    if (!Array.isArray(saved) || saved.some((item) => !item || typeof item.id !== "string" ||
      typeof item.nombre !== "string" || typeof item.correo !== "string" || typeof item.comentario !== "string" || typeof item.createdAt !== "string")) {
      throw new Error("Las consultas guardadas tienen un formato inválido.");
    }
    return saved;
  };

  return {
    list, listMessages,
    create({ user, items, coupon = "", date, time }) {
      if (!user || !["string", "number"].includes(typeof user.id)) throw new Error("Debes iniciar sesión para confirmar la reserva.");
      const canonical = normalizeItems(items, getProducts());
      if (canonical.length === 0) throw new Error("Agrega al menos un producto al carrito.");
      validateSlot(date, time, now());
      const existing = list();
      for (const product of canonical) {
        if (product.quantity > availableQuantity(product, date, time, existing)) {
          throw new Error(`No hay disponibilidad para ${product.nombre} en ese horario. Elige otra hora o reduce la cantidad.`);
        }
      }
      const booking = {
        id: uuid(), userId: user.id, customerName: `${user.nombre || ""} ${user.apellidos || ""}`.trim(),
        items: canonical, coupon: coupon === VALID_COUPON ? coupon : "", date, time,
        durationMinutes: 60, ...calculateTotals(canonical, coupon, getProducts()), status: "confirmada",
        paymentStatus: "sin_cobro_demo", createdAt: now().toISOString(),
      };
      writeJson(storage, RESERVATIONS_KEY, [...existing, booking]);
      return booking;
    },
    cancel(id, user) {
      const existing = list();
      const booking = existing.find((item) => item.id === id);
      if (!booking) throw new Error("La reserva no existe.");
      if (!user || (booking.userId !== user.id && user.role !== "admin")) throw new Error("No tienes permiso para cancelar esta reserva.");
      if (booking.status === "cancelada") throw new Error("La reserva ya está cancelada.");
      validateSlot(booking.date, booking.time, now());
      const updated = { ...booking, status: "cancelada", cancelledAt: now().toISOString() };
      writeJson(storage, RESERVATIONS_KEY, existing.map((item) => item.id === id ? updated : item));
      return updated;
    },
    saveMessage(data) {
      const nombre = typeof data.nombre === "string" ? data.nombre.trim() : "";
      const correo = typeof data.correo === "string" ? data.correo.trim().toLowerCase() : "";
      const comentario = typeof data.comentario === "string" ? data.comentario.trim() : "";
      if (!validarNombre(nombre) || nombre.length > 100) throw new Error("Escribe un nombre válido de hasta 100 caracteres.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || correo.length > 254) throw new Error("Escribe un correo válido.");
      if (!comentario || comentario.length > 2000) throw new Error("Escribe una consulta de entre 1 y 2000 caracteres.");
      const message = { id: uuid(), nombre, correo, comentario, createdAt: now().toISOString(), status: "guardada_localmente" };
      writeJson(storage, MESSAGES_KEY, [...listMessages(), message]);
      return message;
    },
  };
}
