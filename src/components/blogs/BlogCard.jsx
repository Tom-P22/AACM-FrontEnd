function BlogCard({ noticia }) {
  return (
    <div className="card h-100 shadow-sm border-0">
      <img
        src={noticia.imagen}
        className="card-img-top"
        alt={noticia.titulo}
        style={{ height: "180px", objectFit: "cover" }}
      />
      <div className="card-body">
        <span className={`badge ${noticia.badge} mb-2`}>
          {noticia.categoria}
        </span>
        <h5 className="card-title fw-bold">{noticia.titulo}</h5>
        <p className="card-text text-muted small">{noticia.texto}</p>
      </div>
      <div className="card-footer bg-white border-top-0 pb-3">
        <small className="text-muted">
          <i className="fa-regular fa-calendar me-1"></i> {noticia.fecha}
        </small>
      </div>
    </div>
  );
}

export default BlogCard;
