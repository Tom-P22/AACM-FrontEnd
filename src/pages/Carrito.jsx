import { useState } from "react";
import { Link } from "react-router-dom";
import { formatCLP } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Carrito() {
  const {
    items,
    removeFromCart,
    clearCart,
    applyCoupon,
    subtotal,
    discount,
    total,
    discountApplied,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [checkoutMsg, setCheckoutMsg] = useState("");

  const handleCoupon = () => {
    const ok = applyCoupon(couponInput);
    setCouponMsg(
      ok
        ? "¡Cupón SANMIGUEL aplicado! 10% de descuento"
        : "Cupón inválido. Prueba con SANMIGUEL"
    );
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setCheckoutMsg("Debes iniciar sesión para confirmar la reserva");
      return;
    }
    if (items.length === 0) return;

    clearCart();
    setCheckoutMsg(
      "¡Reserva confirmada! Recibirás un correo con los detalles."
    );
  };

  return (
    <div className="container py-5">
      <h2 className="h3 fw-bold mb-4">Mi Carrito de Reserva</h2>

      {checkoutMsg && (
        <div
          className={`alert ${
            checkoutMsg.includes("confirmada")
              ? "alert-success"
              : "alert-warning"
          }`}
        >
          {checkoutMsg}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          {items.length === 0 ? (
            <div className="card shadow-sm p-5 text-center">
              <i className="fa-solid fa-cart-shopping display-4 text-muted mb-3"></i>
              <h4 className="text-muted">Tu carrito está vacío</h4>
              <p className="text-muted small mb-3">
                Agrega canchas o implementos desde el catálogo.
              </p>
              <Link to="/productos" className="btn btn-primary fw-bold">
                Ver Catálogo
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div className="card shadow-sm mb-3" key={item.id}>
                <div className="card-body d-flex gap-3 align-items-center">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <div className="flex-grow-1">
                    <h5 className="fw-bold mb-1">{item.nombre}</h5>
                    <span className="badge bg-primary-subtle text-primary">
                      {item.categoria}
                    </span>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold text-success fs-5">
                      {formatCLP(item.precio)}
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger mt-1"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="fa-solid fa-trash"></i> Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm p-4">
            <h3 className="h5 fw-bold mb-3">Resumen del Pedido</h3>

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>{formatCLP(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2 text-success">
              <span>Descuento Vecino:</span>
              <span>-{formatCLP(discount)}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-3 fw-bold fs-5">
              <span>TOTAL:</span>
              <span className="text-primary">{formatCLP(total)}</span>
            </div>

            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Cupón (SANMIGUEL)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button
                className="btn btn-outline-secondary"
                onClick={handleCoupon}
              >
                Aplicar
              </button>
            </div>
            {couponMsg && (
              <p
                className={`small mb-3 ${
                  discountApplied ? "text-success" : "text-danger"
                }`}
              >
                {couponMsg}
              </p>
            )}

            <button
              className="btn btn-success w-100 fw-bold py-2"
              disabled={items.length === 0}
              onClick={handleCheckout}
            >
              <i className="fa-solid fa-credit-card me-2"></i> Confirmar y Pagar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrito;