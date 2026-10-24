import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import ReservationList from "../components/ReservationList";
import { useAuth } from "../context/AuthContext";
import { useReservations } from "../context/ReservationContext";

export default function MisReservas() {
  const { user } = useAuth();
  const { reservations, cancelReservation } = useReservations();
  const [message, setMessage] = useState(null);
  if (!user) return <Navigate to="/login" replace />;

  const cancel = (id) => {
    const result = cancelReservation(id);
    setMessage({ success: result.success, text: result.success ? "Reserva cancelada. El horario vuelve a estar disponible." : result.message });
  };

  return (
    <div className="container py-5" style={{ maxWidth: "900px" }}>
      <h1 className="h3 fw-bold mb-4">Mis reservas</h1>
      {message && <div className={`alert ${message.success ? "alert-success" : "alert-danger"}`} role="alert">{message.text}</div>}
      <ReservationList reservations={reservations.filter((booking) => booking.userId === user.id)} onCancel={cancel} />
      <Link to="/productos" className="btn btn-primary mt-4">Volver al catálogo</Link>
    </div>
  );
}
