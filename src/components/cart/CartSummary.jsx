import { formatCLP } from "../../utils/format";

function CartSummary({
  subtotal,
  discount,
  total,
  couponInput,
  setCouponInput,
  onApplyCoupon,
  couponMsg,
  discountApplied,
  onCheckout,
  disabled,
}) {
  return (
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
          aria-label="Código de descuento"
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={onApplyCoupon}>
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
        disabled={disabled}
        onClick={onCheckout}
      >
        <i className="fa-solid fa-calendar-check me-2"></i> Confirmar reserva
      </button>
      <p className="small text-muted mt-2 mb-0">El total corresponde al bloque de 60 minutos.</p>
    </div>
  );
}

export default CartSummary;
