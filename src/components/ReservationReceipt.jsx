import Dialog from "./Dialog";
import { formatCLP } from "../utils/format.js";
import { reservationReceipt } from "../utils/receipt.js";

export default function ReservationReceipt({ booking, onClose }) {
  const receipt = reservationReceipt(booking);
  return <Dialog title="Comprobante de reserva" onClose={onClose}>
    <div className="print-receipt">
      <div className="border-bottom pb-3 mb-4"><p className="text-primary fw-bold mb-1">DEPORTES SAN MIGUEL</p><h1 className="h3 fw-bold">Comprobante de reserva</h1><p className="text-muted mb-0">Corporación Municipal</p></div>
      <dl className="row g-2"><div className="col-12"><dt>Código</dt><dd className="small text-break">{receipt.id}</dd></div>
        <div className="col-sm-6"><dt>Vecino</dt><dd>{receipt.customerName || "Usuario registrado"}</dd></div><div className="col-sm-6"><dt>Estado</dt><dd className="text-capitalize">{receipt.status}</dd></div>
        <div className="col-sm-6"><dt>Fecha y hora</dt><dd>{receipt.date} · {receipt.time}</dd></div><div className="col-sm-6"><dt>Duración</dt><dd>{receipt.durationMinutes || 60} minutos</dd></div>
      </dl>
      <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Artículo</th><th>Cantidad</th><th>Precio unitario</th><th>Total</th></tr></thead><tbody>{receipt.items.map((item) => <tr key={item.id}><td>{item.nombre}</td><td>{item.quantity}</td><td>{formatCLP(item.precio)}</td><td>{formatCLP(item.lineTotal)}</td></tr>)}</tbody></table></div>
      <div className="ms-auto" style={{ maxWidth: 320 }}><p className="d-flex justify-content-between"><span>Subtotal</span><span>{formatCLP(receipt.subtotal)}</span></p><p className="d-flex justify-content-between text-success"><span>Descuento{receipt.coupon ? ` (${receipt.coupon})` : ""}</span><span>−{formatCLP(receipt.discount)}</span></p><p className="d-flex justify-content-between fs-5 fw-bold border-top pt-2"><span>Total</span><span>{formatCLP(receipt.total)}</span></p></div>
      <p className="small text-muted">Pago: no registrado. Este documento corresponde a la reserva.</p>
    </div>
    <div className="d-flex gap-2 mt-4 no-print"><button className="btn btn-primary" onClick={() => window.print()}>Imprimir comprobante</button><button className="btn btn-outline-secondary" onClick={onClose}>Cerrar</button></div>
  </Dialog>;
}
