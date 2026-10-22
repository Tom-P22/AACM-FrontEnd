import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { INITIAL_PRODUCTS } from "../data/products";
import { formatCLP } from "../utils/format";
import { useAuth } from "../context/AuthContext";

function Admin() {
  const [tab, setTab] = useState("dashboard");
  const { users, user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Si no hay sesión, redirigir (protección simple)
  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <h3>Debes iniciar sesión para acceder al panel</h3>
        <Link to="/login" className="btn btn-primary mt-3">
          Ir a Login
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-white shadow-sm sticky-top">
        <nav className="navbar navbar-light container py-2">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <i className="fa-solid fa-trophy fs-2 text-primary"></i>
            <div>
              <span className="fw-bold d-block lh-1 text-dark fs-5">
                Deportes San Miguel
              </span>
              <small className="text-muted text-uppercase fs-7">
                Corporación Municipal
              </small>
            </div>
          </Link>
          <div className="ms-auto d-flex gap-2 align-items-center">
            <span className="small text-muted">
              {user?.nombre} {user?.apellidos}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm fw-bold"
            >
              <i className="fa-solid fa-arrow-right-from-bracket me-1"></i>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </header>

      <div className="bg-dark text-white py-2">
        <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
          <span>
            <i className="fa-solid fa-shield-halved me-1"></i> Panel de Gestión
            Activo
          </span>
          <Link to="/" className="btn btn-sm btn-outline-light py-0">
            Volver a Tienda Pública
          </Link>
        </div>
      </div>

      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <aside className="col-md-3 col-lg-2 bg-dark text-white p-3 min-vh-100">
            <div className="fw-bold fs-5 mb-4 border-bottom pb-2">
              <i className="fa-solid fa-gear me-2"></i> Gestión Recintos
            </div>
            <div className="nav flex-column nav-pills gap-2">
              <button
                className={`nav-link text-white text-start ${
                  tab === "dashboard" ? "active bg-primary" : ""
                }`}
                onClick={() => setTab("dashboard")}
              >
                <i className="fa-solid fa-chart-line me-2"></i> Dashboard
              </button>
              <button
                className={`nav-link text-white text-start ${
                  tab === "productos" ? "active bg-primary" : ""
                }`}
                onClick={() => setTab("productos")}
              >
                <i className="fa-solid fa-boxes-stacked me-2"></i> Productos /
                Canchas
              </button>
              <button
                className={`nav-link text-white text-start ${
                  tab === "usuarios" ? "active bg-primary" : ""
                }`}
                onClick={() => setTab("usuarios")}
              >
                <i className="fa-solid fa-users-gear me-2"></i> Usuarios
              </button>
              <button
                className={`nav-link text-white text-start ${
                  tab === "ordenes" ? "active bg-primary" : ""
                }`}
                onClick={() => setTab("ordenes")}
              >
                <i className="fa-solid fa-file-invoice-dollar me-2"></i> Órdenes
                / Reservas
              </button>
            </div>
          </aside>

          <div className="col-md-9 col-lg-10 p-4">
            {tab === "dashboard" && (
              <>
                <h2 className="h4 fw-bold mb-4">Métricas Generales</h2>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="card shadow-sm p-3 border-start border-4 border-primary">
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-calendar-check fs-1 text-primary me-3"></i>
                        <div>
                          <h3 className="h2 fw-bold m-0">
                            {INITIAL_PRODUCTS.length}
                          </h3>
                          <p className="text-muted m-0 small">
                            Canchas e Implementos
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card shadow-sm p-3 border-start border-4 border-success">
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-users fs-1 text-success me-3"></i>
                        <div>
                          <h3 className="h2 fw-bold m-0">{users.length}</h3>
                          <p className="text-muted m-0 small">Usuarios</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card shadow-sm p-3 border-start border-4 border-warning">
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-receipt fs-1 text-warning me-3"></i>
                        <div>
                          <h3 className="h2 fw-bold m-0">0</h3>
                          <p className="text-muted m-0 small">Reservas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {tab === "productos" && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h4 fw-bold m-0">Productos / Canchas</h2>
                </div>
                <div className="table-responsive bg-white shadow-sm rounded">
                  <table className="table table-hover align-middle m-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INITIAL_PRODUCTS.map((p) => (
                        <tr key={p.id}>
                          <td className="fw-bold">{p.id}</td>
                          <td>{p.nombre}</td>
                          <td>
                            <span className="badge bg-primary-subtle text-primary">
                              {p.categoria}
                            </span>
                          </td>
                          <td>{formatCLP(p.precio)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {tab === "usuarios" && (
              <>
                <h2 className="h4 fw-bold mb-3">Listado de Usuarios</h2>
                {users.length === 0 ? (
                  <div className="alert alert-info">
                    Aún no hay usuarios registrados.
                  </div>
                ) : (
                  <div className="table-responsive bg-white shadow-sm rounded">
                    <table className="table table-hover align-middle m-0">
                      <thead className="table-light">
                        <tr>
                          <th>RUN</th>
                          <th>Nombre</th>
                          <th>Correo</th>
                          <th>Comuna</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td className="fw-bold">{u.run}</td>
                            <td>
                              {u.nombre} {u.apellidos}
                            </td>
                            <td>{u.correo}</td>
                            <td>{u.comuna}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {tab === "ordenes" && (
              <>
                <h2 className="h4 fw-bold mb-3">Órdenes / Reservas</h2>
                <div className="alert alert-info">
                  Las reservas se confirman desde el carrito. Historial de
                  órdenes se puede ampliar más adelante.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;