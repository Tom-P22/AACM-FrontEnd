import { formatCLP } from "../../utils/format";

function ProductCard({ product, inCart, onAdd }) {
  return (
    <div className="card h-100 shadow-sm border-0">
      <img
        src={product.imagen}
        className="card-img-top"
        alt={product.nombre}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">
            {product.categoria}
          </span>
          <span className="fw-bold text-success fs-5">
            {formatCLP(product.precio)}
          </span>
        </div>
        <h5 className="card-title fw-bold fs-6">{product.nombre}</h5>
        <p className="card-text text-muted small flex-grow-1">
          {product.descripcion}
        </p>
        <button
          className={`btn fw-bold mt-2 ${
            inCart ? "btn-success" : "btn-primary"
          }`}
          onClick={() => onAdd(product)}
          disabled={inCart}
        >
          <i
            className={`fa-solid ${
              inCart ? "fa-check" : "fa-cart-plus"
            } me-1`}
          ></i>
          {inCart ? "En el carrito" : "Agregar a Reservas"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
