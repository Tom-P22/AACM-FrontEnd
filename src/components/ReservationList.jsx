import { formatCLP } from "../utils/format";
import { useNow } from "../hooks/useNow";
import { useState } from "react";
import { filterReservations } from "../utils/filters.js";
import ReservationReceipt from "./ReservationReceipt";
import ConfirmDialog from "./ConfirmDialog";

export default function ReservationList({ reservations, onCancel, showCustomer = false }) {
  const now = useNow();
  const [query, setQuery] = useState(""); const [date, setDate] = useState(""); const [status, setStatus] = useState("");
  const visible = filterReservations(reservations, { query, date, status });
  const [detailId, setDetailId] = useState(null);
  const detail = reservations.find((booking) => booking.id === detailId);
  const [pendingId, setPendingId] = useState(null);
  const pending = reservations.find((booking) => booking.id === pendingId);
  if (reservations.length === 0) return <p className="alert alert-info">Aún no hay reservas registradas.</p>;
  return (
    <>
    <div className="row g-3 mb-3"><div className="col-md-6"><label htmlFor="reserva-buscar" className="form-label">{showCustomer ? "Buscar vecino, código o producto" : "Buscar código o producto"}</label><input id="reserva-buscar" type="search" className="form-control" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="col-md-3"><label htmlFor="reserva-filtrar-fecha" className="form-label">Fecha</label><input id="reserva-filtrar-fecha" type="date" className="form-control" value={date} onChange={(event) => setDate(event.target.value)} /></div><div className="col-md-3"><label htmlFor="reserva-filtrar-estado" className="form-label">Estado</label><select id="reserva-filtrar-estado" className="form-select" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos</option><option value="confirmada">Confirmadas</option><option value="cancelada">Canceladas</option></select></div></div>
    <div className="d-flex align-items-center gap-3 mb-3"><small className="text-muted">{visible.length} reservas</small><button className="btn btn-link btn-sm p-0" onClick={() => { setQuery(""); setDate(""); setStatus(""); }}>Limpiar filtros</button></div>
    {visible.length === 0 && <p className="text-muted">No hay reservas que coincidan con los filtros.</p>}
    <div className="d-grid gap-3">
      {[...visible].reverse().map((booking) => (
        <article className="card shadow-sm" key={booking.id}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
              <div>
                <h3 className="h6 fw-bold">Reserva {booking.id.slice(0, 8)}</h3>
                <p className="mb-1">{booking.date} a las {booking.time} · 60 minutos</p>
                {showCustomer && <p className="mb-1">{booking.customerName}</p>}
              </div>
              <span className={`badge ${booking.status === "confirmada" ? "bg-success" : "bg-secondary"}`}>{booking.status}</span>
            </div>
            <ul className="my-2">{booking.items.map((item) => <li key={item.id}>{item.nombre} × {item.quantity} — {formatCLP(item.precio * item.quantity)}</li>)}</ul>
            <p className="fw-bold mb-1">Total: {formatCLP(booking.total)}</p>
            {booking.discount > 0 && <p className="small text-success mb-1">Descuento: {formatCLP(booking.discount)}</p>}
            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setDetailId(booking.id)}>Ver comprobante</button>
            {booking.status === "confirmada" && new Date(`${booking.date}T${booking.time}:00`) > now && (
              <button className="btn btn-sm btn-outline-danger" onClick={() => setPendingId(booking.id)}>Cancelar reserva</button>
            )}
          </div>
        </article>
      ))}
    </div>
    {detail && <ReservationReceipt booking={detail} onClose={() => setDetailId(null)} />}
    {pending && <ConfirmDialog title="Cancelar reserva" confirmLabel="Sí, cancelar reserva" onClose={() => setPendingId(null)} onConfirm={() => { onCancel(pending.id); setPendingId(null); }}>
      <p>¿Quieres cancelar la reserva <strong>{pending.id.slice(0, 8)}</strong> del {pending.date} a las {pending.time}?</p>
      <p className="text-muted mb-0">El horario quedará disponible y la reserva se conservará en tu historial como cancelada.</p>
    </ConfirmDialog>}
    </>
  );
}
