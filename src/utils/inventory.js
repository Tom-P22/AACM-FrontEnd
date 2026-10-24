export function capacity(product) {
  return Number.isSafeInteger(product.stock) && product.stock >= 0 ? product.stock : product.categoria === "Canchas" ? 1 : 10;
}

export function minimumRequiredStock(reservations, productId, now = new Date()) {
  if (!Array.isArray(reservations)) throw new Error("No se pudo validar el stock contra las reservas guardadas.");
  const blocks = new Map();
  for (const booking of reservations) {
    if (!booking || !Array.isArray(booking.items)) throw new Error("El historial de reservas tiene un formato inválido.");
    if (booking.status !== "confirmada" || new Date(`${booking.date}T${booking.time}:00`) <= now) continue;
    const quantity = booking.items.filter((item) => item.id === productId).reduce((sum, item) => {
      if (!Number.isSafeInteger(item.quantity) || item.quantity < 1) throw new Error("La cantidad reservada no es válida.");
      return sum + item.quantity;
    }, 0);
    const key = `${booking.date} ${booking.time}`;
    blocks.set(key, (blocks.get(key) || 0) + quantity);
  }
  return Math.max(0, ...blocks.values());
}
