export function reservationReceipt(booking) {
  if (!booking || !Array.isArray(booking.items) || !Number.isFinite(booking.total)) throw new Error("La reserva no tiene un detalle válido.");
  const items = booking.items.map((item) => {
    if (!Number.isFinite(item.precio) || item.precio < 0 || !Number.isSafeInteger(item.quantity) || item.quantity < 1) throw new Error("El detalle de la reserva contiene valores inválidos.");
    return { ...item, lineTotal: item.precio * item.quantity };
  });
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return { ...booking, items, subtotal, discount: Math.max(0, subtotal - booking.total) };
}
