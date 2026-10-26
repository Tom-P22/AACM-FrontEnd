import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import BlogCard from "../components/blogs/BlogCard";
import { formatCLP } from "../utils/format";

export default function Home() {
  const { products, news } = useContent();
  const destacados = products.filter((product) => product.active !== false).slice(0, 3);
  const ultimasNoticias = news.filter((item) => item.active !== false).sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id).slice(0, 3);
  return <>
    <section className="hero-banner bg-primary text-white text-center py-5">
      <div className="container py-4 my-3">
        <h1 className="display-5 fw-bold mb-3">Reserva tus Canchas e Implementos en San Miguel</h1>
        <p className="lead col-md-8 mx-auto mb-4">Fomentamos el deporte y la vida sana en nuestra comuna. Reserva instalaciones deportivas de primer nivel de forma rápida y transparente.</p>
        <Link to="/productos" className="btn btn-success btn-lg fw-bold px-4"><i className="fa-solid fa-calendar-check me-2"></i>Ver Canchas y Equipamiento</Link>
      </div>
    </section>
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
        <h2 className="h3 fw-bold border-start border-4 border-primary ps-3 text-primary m-0">Últimas Noticias</h2>
        <Link to="/blogs" className="btn btn-outline-primary btn-sm fw-bold">Ver más... <i className="fa-solid fa-arrow-right ms-1"></i></Link>
      </div>
      <div className="row g-4">{ultimasNoticias.map((noticia) => <div key={noticia.id} className="col-md-4"><BlogCard noticia={noticia} /></div>)}</div>
      {ultimasNoticias.length === 0 && <p className="text-muted">Pronto publicaremos nuevas noticias.</p>}
    </div>
    <div className="container pb-5">
      <h2 className="h3 fw-bold border-start border-4 border-info ps-3 mb-4 text-primary">Destacados del Polideportivo</h2>
      <div className="row g-4">{destacados.map((product) => <div className="col-md-4" key={product.id}>
        <div className="card h-100 shadow-sm border-0">
          <img src={product.imagen} className="card-img-top" alt={product.nombre} />
          <div className="card-body d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start mb-2 gap-2"><span className="badge bg-primary-subtle text-primary">{product.categoria}</span><span className="fw-bold text-success fs-5">{formatCLP(product.precio)}</span></div>
            <h3 className="h6 fw-bold">{product.nombre}</h3><p className="text-muted small flex-grow-1">{product.descripcion}</p>
            <Link to="/productos" className="btn btn-outline-primary btn-sm mt-auto">Ver en catálogo</Link>
          </div>
        </div>
      </div>)}</div>
    </div>
  </>;
}
