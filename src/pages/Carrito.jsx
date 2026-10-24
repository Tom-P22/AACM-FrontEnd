import { useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useReservations } from "../context/ReservationContext";
import { availableQuantity, BOOKING_HOURS, localDate } from "../utils/reservations.js";
import { useNow } from "../hooks/useNow";

export default function Carrito() {
  const { items, updateQuantity, removeFromCart, clearCart, applyCoupon, subtotal, discount, total,
    discountApplied, coupon, date, time, setSchedule, cartError } = useCart();
  const { isAuthenticated } = useAuth();
  const { createReservation, reservations } = useReservations();
  const [couponInput, setCouponInput] = useState(coupon);
  const [couponMsg, setCouponMsg] = useState("");
  const [checkout, setCheckout] = useState(null);
  const now = useNow();

  const handleCoupon = () => {
    const ok = applyCoupon(couponInput);
    setCouponMsg(ok ? "Cupón SANMIGUEL aplicado: 10% de descuento." : "Cupón inválido o no se pudo guardar. Usa SANMIGUEL.");
  };

  const handleCheckout = () => {
    if (checkout?.success) return;
    if (!isAuthenticated) {
      setCheckout({ success: false, message: "Debes iniciar sesión para confirmar la reserva." });
      return;
    }
    const result = createReservation({ items, coupon, date, time });
    if (!result.success) {
      setCheckout({ success: false, message: result.message });
      return;
    }
    const cleared = clearCart();
    setCouponInput("");
    setCouponMsg("");
    setCheckout({ success: true, message: `Reserva local ${result.item.id.slice(0, 8)} guardada para ${date} a las ${time}. Sin cobro ni envío de correo.${cleared.success ? "" : " No se pudo vaciar el carrito; revísalo antes de reservar nuevamente."}` });
  };

  return (
    <div className="container py-5">
      <h1 className="h3 fw-bold mb-4">Mi carrito de reserva</h1>
      {checkout && <div className={`alert ${checkout.success ? "alert-success" : "alert-warning"}`} role="alert">
        {checkout.message} {checkout.success && <Link to="/mis-reservas">Ver mis reservas</Link>}
      </div>}
      {!isAuthenticated && <p className="alert alert-info"><Link to="/login">Inicia sesión</Link> o <Link to="/registro">regístrate</Link> para confirmar. Tu carrito se conservará.</p>}
      <div className="row g-4">
        <div className="col-lg-8">
          {items.length === 0 ? <div className="card shadow-sm p-5 text-center">
            <h2 className="h5">Tu carrito está vacío</h2>
            <p>Agrega canchas o implementos desde el catálogo.</p>
            <Link to="/productos" className="btn btn-primary">Ver catálogo</Link>
          </div> : <>
            {items.map((item) => <CartItem key={item.id} item={item} onRemove={removeFromCart} onQuantityChange={updateQuantity} />)}
            <div className="card shadow-sm p-4 mb-3">
              <h2 className="h5 fw-bold">Fecha y horario</h2>
              <p className="text-muted small">Todos los artículos se reservan para el mismo bloque de 60 minutos. Hay una cancha de cada tipo y 10 unidades de cada implemento o set por horario.</p>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="reserva-fecha" className="form-label">Fecha *</label>
                  <input id="reserva-fecha" type="date" min={localDate(now)} className="form-control" value={date} onChange={(event) => { setCheckout(null); setSchedule(event.target.value, time); }} />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="reserva-hora" className="form-label">Hora de inicio *</label>
                  <select id="reserva-hora" className="form-select" value={time} onChange={(event) => { setCheckout(null); setSchedule(date, event.target.value); }}>
                    <option value="">Selecciona una hora</option>
                    {BOOKING_HOURS.map((hour) => {
                      const past = !date || new Date(`${date}T${hour}:00`) <= now;
                      const unavailable = items.some((item) => item.quantity > availableQuantity(item, date, hour, reservations));
                      return <option key={hour} disabled={past || unavailable} value={hour}>{hour}{unavailable ? " — sin disponibilidad" : ""}</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>
            <button className="btn btn-outline-danger btn-sm" onClick={() => { clearCart(); setCouponInput(""); setCouponMsg(""); setCheckout(null); }}>Vaciar carrito</button>
          </>}
        </div>
        <div className="col-lg-4">
          <CartSummary subtotal={subtotal} discount={discount} total={total} couponInput={couponInput}
            setCouponInput={setCouponInput} onApplyCoupon={handleCoupon} couponMsg={couponMsg}
            discountApplied={discountApplied} onCheckout={handleCheckout}
            disabled={items.length === 0 || !!cartError || !!checkout?.success} />
        </div>
      </div>
    </div>
  );
}
