const NOTICIAS = [
  {
    id: 1,
    titulo: "Inscripciones abiertas: Torneo Comunal de Tenis 2026",
    categoria: "Comunidad",
    badge: "bg-primary",
    imagen: "/img/ConcursoTenis.jpg",
    fecha: "05 Septiembre, 2026",
    texto:
      "Únete al torneo anual que reúne a los mejores exponentes locales. Categorías todo competidor y senior.",
  },
  {
    id: 2,
    titulo: "Nuevas luminarias LED en multicanchas",
    categoria: "Infraestructura",
    badge: "bg-success",
    imagen: "/img/LuminariaLedCancha.jpg",
    fecha: "01 Septiembre, 2026",
    texto:
      "Hemos actualizado el sistema de iluminación en 3 de nuestras multicanchas para mejorar la experiencia nocturna.",
  },
  {
    id: 3,
    titulo: "Nuevos talleres de fútbol formativo",
    categoria: "Talleres",
    badge: "bg-info",
    imagen: "/img/TallerFutbol.jpg",
    fecha: "28 Agosto, 2026",
    texto:
      "La corporación abre cupos limitados para talleres formativos orientados a niños y niñas entre 8 y 12 años.",
  },
];

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
        {NOTICIAS.map((n) => (
          <div className="col-md-4" key={n.id}>
            <div className="card h-100 shadow-sm border-0">
              <img
                src={n.imagen}
                className="card-img-top"
                alt={n.titulo}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body">
                <span className={`badge ${n.badge} mb-2`}>{n.categoria}</span>
                <h5 className="card-title fw-bold">{n.titulo}</h5>
                <p className="card-text text-muted small">{n.texto}</p>
              </div>
              <div className="card-footer bg-white border-top-0 pb-3">
                <small className="text-muted">
                  <i className="fa-regular fa-calendar me-1"></i> {n.fecha}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blogs;