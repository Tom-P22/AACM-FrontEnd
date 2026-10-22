import { useState } from "react";
import { INITIAL_PRODUCTS } from "../data/products";
import { formatCLP } from "../utils/format";
import { useCart } from "../context/CartContext";

function Productos() {
  const [filtro, setFiltro] = useState("ALL");
  const { addToCart, items } = useCart();
  const [msg, setMsg] = useState("");

  const productosFiltrados =
    filtro === "ALL"
      ? INITIAL_PRODUCTS
      : INITIAL_PRODUCTS.filter((p) => p.categoria === filtro);

  const handleAdd = (product) => {
    const already = items.find((i) => i.id === product.id);
    if (already) {
      setMsg(`"${product.nombre}" ya está en tu carrito`);
    } else {
      addToCart(product);
      setMsg(`"${product.nombre}" agregado a reservas`);
    }
    setTimeout(() => setMsg(""), 2500);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 className="h3 fw-bold m-0">
          Catálogo de Canchas y Artículos Deportivos
        </h2>
        <select
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

      {msg && (
        <div className="alert alert-success py-2">{msg}</div>
      )}

      <div className="row g-4">
        {productosFiltrados.map((p) => {
          const inCart = items.some((i) => i.id === p.id);
          return (
            <div className="col-md-6 col-lg-4" key={p.id}>
              <div className="card h-100 shadow-sm border-0">
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
                    onClick={() => handleAdd(p)}
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
            </div>
          );
        })}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="text-center text-muted py-5">
          No hay productos en esta categoría.
        </div>
      )}
    </div>
  );
}

export default Productos;
