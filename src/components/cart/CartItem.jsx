import { formatCLP } from "../../utils/format";
import { capacity } from "../../utils/cart.js";

function CartItem({ item, onRemove, onQuantityChange }) {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body d-flex gap-3 align-items-center flex-wrap">
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
          <div className="d-flex align-items-center gap-2 mt-2">
            <button className="btn btn-sm btn-outline-secondary" aria-label={`Reducir cantidad de ${item.nombre}`} onClick={() => onQuantityChange(item, item.quantity - 1)}>−</button>
            <span>Cantidad: {item.quantity}</span>
            <button className="btn btn-sm btn-outline-secondary" disabled={item.quantity >= capacity(item)} aria-label={`Aumentar cantidad de ${item.nombre}`} onClick={() => onQuantityChange(item, item.quantity + 1)}>+</button>
          </div>
        </div>
        <div className="text-end">
          <div className="fw-bold text-success fs-5">
            {formatCLP(item.precio * item.quantity)}
          </div>
          <button
            className="btn btn-sm btn-outline-danger mt-1"
            onClick={() => onRemove(item.id)}
          >
            <i className="fa-solid fa-trash"></i> Quitar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
