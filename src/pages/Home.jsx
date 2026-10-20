import { Link } from "react-router-dom";
import { INITIAL_PRODUCTS } from "../data/products";
import { formatCLP } from "../utils/format";

function Home() {
  const destacados = INITIAL_PRODUCTS.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="hero-banner bg-primary text-white text-center py-5">
        <div className="container py-4 my-3">
          <h1 className="display-5 fw-bold mb-3">
            Reserva tus Canchas e Implementos en San Miguel
          </h1>
          <p className="lead col-md-8 mx-auto mb-4">
            Fomentamos el deporte y la vida sana en nuestra comuna. Reserva
            instalaciones deportivas de primer nivel de forma rápida y
            transparente.
          </p>
          <Link
            to="/productos"
            className="btn btn-success btn-lg fw-bold px-4"
          >
            <i className="fa-solid fa-calendar-check me-2"></i>
            Ver Canchas y Equipamiento
          </Link>
        </div>
      </section>

      {/* Últimas Noticias */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3 fw-bold border-start border-4 border-primary ps-3 text-primary m-0">
            Últimas Noticias
          </h2>
          <Link to="/blogs" className="btn btn-outline-primary btn-sm fw-bold">
            Ver más... <i className="fa-solid fa-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <img
                src="/img/ConcursoTenis.jpg"
                className="card-img-top"
                alt="Torneo Tenis"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body">
                <span className="badge bg-primary mb-2">Comunidad</span>
                <h5 className="card-title fw-bold fs-6">
                  Inscripciones abiertas: Torneo Comunal de Tenis 2026
                </h5>
                <p className="card-text text-muted small">
                  Únete al torneo anual que reúne a los mejores exponentes
                  locales. Categorías todo competidor.
                </p>
              </div>
              <div className="card-footer bg-white border-top-0 pb-3">
                <small className="text-muted">
                  <i className="fa-regular fa-calendar me-1"></i> 05 Septiembre,
                  2026
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <img
                src="/img/LuminariaLedCancha.jpg"
                className="card-img-top"
                alt="Remodelación"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body">
                <span className="badge bg-success mb-2">Infraestructura</span>
                <h5 className="card-title fw-bold fs-6">
                  Nuevas luminarias LED en multicanchas
                </h5>
                <p className="card-text text-muted small">
                  Hemos actualizado el sistema de iluminación en 3 de nuestras
                  multicanchas para mejorar la experiencia nocturna.
                </p>
              </div>
              <div className="card-footer bg-white border-top-0 pb-3">
                <small className="text-muted">
                  <i className="fa-regular fa-calendar me-1"></i> 01 Septiembre,
                  2026
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <img
                src="/img/TallerFutbol.jpg"
                className="card-img-top"
                alt="Taller"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body">
                <span className="badge bg-info mb-2">Talleres</span>
                <h5 className="card-title fw-bold fs-6">
                  Nuevos talleres de fútbol formativo
                </h5>
                <p className="card-text text-muted small">
                  La corporación abre cupos limitados para talleres formativos
                  orientados a niños y niñas entre 8 y 12 años.
                </p>
              </div>
              <div className="card-footer bg-white border-top-0 pb-3">
                <small className="text-muted">
                  <i className="fa-regular fa-calendar me-1"></i> 28 Agosto, 2026
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Destacados */}
      <div className="container pb-5">
        <h2 className="h3 fw-bold border-start border-4 border-info ps-3 mb-4 text-primary">
          Destacados del Polideportivo
        </h2>
        <div className="row g-4">
          {destacados.map((p) => (
            <div className="col-md-4" key={p.id}>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
