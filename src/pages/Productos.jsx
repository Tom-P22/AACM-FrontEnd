import { useEffect, useRef, useState } from "react";
import { useContent } from "../context/ContentContext";
import { formatCLP } from "../utils/format";
import { useCart } from "../context/CartContext";
import { capacity } from "../utils/cart.js";

function Productos() {
  const { products } = useContent();
  const [filtro, setFiltro] = useState("ALL");
  const { updateQuantity, getItemQuantity } = useCart();
  
  // Estado para controlar el modal y el producto seleccionado
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  const modalRef = useRef(null);
  useEffect(() => {
    if (!selectedProduct) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") setSelectedProduct(null);
      if (event.key !== "Tab") return;
      const controls = Array.from(modalRef.current?.querySelectorAll("button:not(:disabled), [href], input:not(:disabled), select:not(:disabled)") || []);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === modalRef.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === modalRef.current)) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [selectedProduct]);

  const productosFiltrados =
    filtro === "ALL"
      ? products.filter((p) => p.active !== false)
      : products.filter((p) => p.active !== false && p.categoria === filtro);

  // Abrir Modal de detalle
  const handleOpenModal = (product) => {
    const currentQty = getItemQuantity(product.id);
    setSelectedProduct(product);
    setModalQuantity(currentQty > 0 ? currentQty : 1);
  };

  // Cerrar Modal
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  // Guardar/Actualizar la cantidad desde el modal
  const handleSaveModal = () => {
    if (selectedProduct) {
      const result = updateQuantity(selectedProduct, modalQuantity);
      if (result.success) handleCloseModal();
    }
  };

  // Eliminar producto de la reserva desde el modal
  const handleRemoveModal = () => {
    if (selectedProduct) {
      const result = updateQuantity(selectedProduct, 0);
      if (result.success) handleCloseModal();
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 className="h3 fw-bold m-0">
          Catálogo de Canchas y Artículos Deportivos
        </h2>
        <select
          aria-label="Filtrar por categoría"
          className="form-select w-auto"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="ALL">Todas las Categorías</option>
          <option value="Canchas">Canchas Deportivas</option>
          <option value="Implementos">Implementos Deportivos</option>
          <option value="Indumentaria">Indumentaria y Petos</option>
        </select>
      </div>

      <div className="row g-4">
        {productosFiltrados.map((p) => {
          const qty = getItemQuantity(p.id);
          const inCart = qty > 0;

          return (
            <div className="col-md-6 col-lg-4" key={p.id}>
              <div 
                className="card h-100 shadow-sm border-0" 
                style={{ cursor: "pointer" }}
                onClick={() => handleOpenModal(p)}
              >
                <img
                  src={p.imagen}
                  className="card-img-top"
                  alt={p.nombre}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">
                      {p.categoria}
                    </span>
                    <span className="fw-bold text-success fs-5">
                      {formatCLP(p.precio)}
                    </span>
                  </div>
                  <h5 className="card-title fw-bold fs-6">{p.nombre}</h5>
                  <p className="card-text text-muted small flex-grow-1">
                    {p.descripcion}
                  </p>
                  <button
                    className={`btn fw-bold mt-2 ${
                      inCart ? "btn-success" : "btn-primary"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation(); // Evita reabrir el modal al pulsar directamente el botón
                      if (inCart) {
                        handleOpenModal(p);
                      } else {
                        updateQuantity(p, 1);
                      }
                    }}
                  >
                    <i
                      className={`fa-solid ${
                        inCart ? "fa-check" : "fa-cart-plus"
                      } me-1`}
                    ></i>
                    {inCart ? `En el carrito (${qty})` : "Agregar a Reservas"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="text-center text-muted py-5">
          No hay productos en esta categoría.
        </div>
      )}

      {/* Modal de Detalle de Producto */}
      {selectedProduct && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="producto-modal-titulo"
          onClick={handleCloseModal}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 id="producto-modal-titulo" className="modal-title fw-bold">{selectedProduct.nombre}</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar detalle"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-5">
                    <img
                      src={selectedProduct.imagen}
                      alt={selectedProduct.nombre}
                      className="img-fluid rounded shadow-sm w-100"
                      style={{ maxHeight: "250px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-7 d-flex flex-column justify-content-between">
                    <div>
                      <span className="badge bg-primary-subtle text-primary fw-bold mb-2">
                        {selectedProduct.categoria}
                      </span>
                      <h4 className="fw-bold text-success">
                        {formatCLP(selectedProduct.precio)}
                      </h4>
                      <p className="text-muted mt-2">{selectedProduct.descripcion}</p>
                    </div>

                    <div className="my-3">
                      <label className="form-label fw-bold small">Cantidad:</label>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm px-3"
                          disabled={modalQuantity <= 1}
                          aria-label="Reducir cantidad"
                          onClick={() =>
                            setModalQuantity((q) => Math.max(1, q - 1))
                          }
                        >
                          -
                        </button>
                        <span className="fw-bold px-2">{modalQuantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm px-3"
                          disabled={modalQuantity >= capacity(selectedProduct)}
                          aria-label="Aumentar cantidad"
                          onClick={() => setModalQuantity((q) => Math.min(capacity(selectedProduct), q + 1))}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                {getItemQuantity(selectedProduct.id) > 0 ? (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleRemoveModal}
                  >
                    Quitar de Reservas
                  </button>
                ) : (
                  <div></div>
                )}
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary fw-bold"
                    onClick={handleSaveModal}
                  >
                    {getItemQuantity(selectedProduct.id) > 0
                      ? "Actualizar Reserva"
                      : "Agregar a Reservas"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;
