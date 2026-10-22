import { Link } from "react-router-dom";

function Admin() {
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
            <span className="small text-muted">Usuario Admin</span>
            <Link to="/" className="btn btn-outline-danger btn-sm fw-bold">
              <i className="fa-solid fa-arrow-right-from-bracket me-1"></i>
              Cerrar Sesión
            </Link>
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
              <button className="nav-link text-white text-start active bg-primary">
                <i className="fa-solid fa-chart-line me-2"></i> Dashboard
              </button>
              <button className="nav-link text-white text-start">
                <i className="fa-solid fa-boxes-stacked me-2"></i> Productos / Canchas
              </button>
              <button className="nav-link text-white text-start">
                <i className="fa-solid fa-users-gear me-2"></i> Usuarios
              </button>
              <button className="nav-link text-white text-start">
                <i className="fa-solid fa-file-invoice-dollar me-2"></i> Órdenes / Reservas
              </button>
            </div>
          </aside>

          <div className="col-md-9 col-lg-10 p-4">
            <h2 className="h4 fw-bold mb-4">Métricas Generales</h2>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="card shadow-sm p-3 border-start border-4 border-primary">
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-calendar-check fs-1 text-primary me-3"></i>
                    <div>
                      <h3 className="h2 fw-bold m-0">6</h3>
                      <p className="text-muted m-0 small">Canchas e Implementos</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm p-3 border-start border-4 border-success">
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-users fs-1 text-success me-3"></i>
                    <div>
                      <h3 className="h2 fw-bold m-0">2</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;