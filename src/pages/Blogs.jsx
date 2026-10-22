function Blogs() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Noticias y Eventos</h1>
        <p className="text-muted">
          Entérate de las últimas novedades deportivas de San Miguel.
        </p>
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
              <h5 className="card-title fw-bold">
                Inscripciones abiertas: Torneo Comunal de Tenis 2026
              </h5>
              <p className="card-text text-muted small">
                Únete al torneo anual que reúne a los mejores exponentes
                locales. Categorías todo competidor y senior.
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
              <h5 className="card-title fw-bold">
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
              <h5 className="card-title fw-bold">
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
  );
}

export default Blogs;