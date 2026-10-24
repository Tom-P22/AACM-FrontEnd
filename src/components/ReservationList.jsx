import { formatCLP } from "../utils/format";
import { useNow } from "../hooks/useNow";

export default function ReservationList({ reservations, onCancel, showCustomer = false }) {
  const now = useNow();
  if (reservations.length === 0) return <p className="alert alert-info">Aún no hay reservas registradas.</p>;
  return (
    <div className="d-grid gap-3">
      {[...reservations].reverse().map((booking) => (
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
            <p className="small text-muted">Reserva local de demostración · Sin cobro</p>
            {booking.status === "confirmada" && new Date(`${booking.date}T${booking.time}:00`) > now && (
              <button className="btn btn-sm btn-outline-danger" onClick={() => onCancel(booking.id)}>Cancelar reserva</button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
