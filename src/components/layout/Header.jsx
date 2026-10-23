import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { totalItems, cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  // Calcula el total de ítems en el carrito de forma segura
  const count = totalItems ?? cart?.reduce((acc, item) => acc + (item.quantity || 1), 0) ?? 0;

  return (
    <header className="bg-white shadow-sm sticky-top" id="public-header">
      <nav className="navbar navbar-expand-lg navbar-light container py-2">
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

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-semibold">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                <i className="fa-solid fa-house me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/productos">
                <i className="fa-solid fa-volleyball me-1"></i> Canchas e Equipamiento
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/nosotros">
                <i className="fa-solid fa-users me-1"></i> Nosotros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/blogs">
                <i className="fa-solid fa-newspaper me-1"></i> Noticias
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contacto">
                <i className="fa-solid fa-envelope me-1"></i> Contacto
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <Link
              to="/carrito"
              className="btn btn-light rounded-pill position-relative fw-semibold px-3"
            >
              <i className="fa-solid fa-cart-shopping me-1"></i> Reservas
              {count > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {count}
                </span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/perfil"
                  className="btn btn-outline-primary btn-sm fw-bold d-flex align-items-center gap-1"
                >
                  <i className="fa-solid fa-user-gear"></i>
                  <span>Mi Perfil ({user?.nombre || user?.nombreCompleto || "Usuario"})</span>
                </Link>
                {user?.role === "admin" && (
                  <Link to="/admin" className="btn btn-outline-dark btn-sm fw-bold">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="btn btn-outline-danger btn-sm fw-bold"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link
                  to="/login"
                  className="btn btn-outline-primary btn-sm fw-bold"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="btn btn-primary btn-sm fw-bold"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;