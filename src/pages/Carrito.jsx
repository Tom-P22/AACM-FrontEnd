import { Link } from "react-router-dom";

function Carrito() {
  return (
    <div className="container py-5">
      <h2 className="h3 fw-bold mb-4">Mi Carrito de Reserva</h2>

      <div className="row g-4">
        {/* Lista de productos en el carrito */}
        <div className="col-lg-8" id="cart-items-list">
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
        </div>

        {/* Resumen del pedido */}
        <div className="col-lg-4">
          <div className="card shadow-sm p-4">
            <h3 className="h5 fw-bold mb-3">Resumen del Pedido</h3>

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>$0</span>
            </div>
            <div className="d-flex justify-content-between mb-2 text-success">
              <span>Descuento Vecino:</span>
              <span>-$0</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-3 fw-bold fs-5">
              <span>TOTAL:</span>
              <span className="text-primary">$0</span>
            </div>

            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Cupón (SANMIGUEL)"
              />
              <button className="btn btn-outline-secondary">Aplicar</button>
            </div>

            <button className="btn btn-success w-100 fw-bold py-2">
              <i className="fa-solid fa-credit-card me-2"></i> Confirmar y Pagar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrito;