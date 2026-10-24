import { useContent } from "../context/ContentContext";
import BlogCard from "../components/blogs/BlogCard";

export default function Blogs() {
  const { news } = useContent();
  const visible = news.filter((item) => item.active !== false).sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
  return <div className="container py-5">
    <div className="text-center mb-5"><h1 className="fw-bold">Noticias y Eventos</h1><p className="text-muted">Entérate de las últimas novedades deportivas de San Miguel.</p></div>
    <div className="row g-4">{visible.map((noticia) => <div key={noticia.id} className="col-md-4"><BlogCard noticia={noticia} /></div>)}</div>
    {visible.length === 0 && <p className="text-center text-muted">Pronto publicaremos nuevas noticias.</p>}
  </div>;
}
