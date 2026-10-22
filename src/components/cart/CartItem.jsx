import { formatCLP } from "../../utils/format";

function CartItem({ item, onRemove }) {
  return (
    <div className="card shadow-sm mb-3">
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
