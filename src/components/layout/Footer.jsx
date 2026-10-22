import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto pt-5">
      <div className="container">
        <div className="row g-4 pb-4 border-bottom border-secondary">
          <div className="col-md-4">
            <h4 className="h5 fw-bold text-info">Deportes San Miguel</h4>
            <p className="small text-secondary">
              Promoviendo la actividad física y el encuentro comunitario.
            </p>
          </div>

          <div className="col-md-4">
            <h4 className="h5 fw-bold text-info">Enlaces Rápidos</h4>
            <ul className="list-unstyled small">
              <li>
                <Link
                  to="/productos"
                  className="text-secondary text-decoration-none"
                >
                  Catálogo Canchas
                </Link>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="text-secondary text-decoration-none"
                >
                  Atención al Vecino
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h4 className="h5 fw-bold text-info">Contacto Recintos</h4>
            <p className="small text-secondary m-0">
              <i className="fa-solid fa-location-dot me-2"></i> Av. Alcalde
              Pedro Alarcón 1063
            </p>
            <p className="small text-secondary m-0">
              <i className="fa-solid fa-phone me-2"></i> +56 2 2678 9000
            </p>
          </div>
        </div>

        <div className="text-center py-3 small text-secondary">
          &copy; 2026 Municipalidad de San Miguel - Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
