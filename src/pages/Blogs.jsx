import { useContent } from "../context/ContentContext";
import BlogCard from "../components/blogs/BlogCard";
import QuickCreate from "../components/QuickCreate";
import { useState } from "react";
import { matchesQuery } from "../utils/filters.js";
import { NEWS_CATEGORIES } from "../data/news.js";

export default function Blogs() {
  const { news } = useContent();
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("");
  const visible = news.filter((item) => item.active !== false && (!category || item.categoria === category) && matchesQuery(query, [item.titulo, item.texto, item.categoria])).sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
  return <div className="container py-5">
    <div className="text-center mb-5"><h1 className="fw-bold">Noticias y Eventos</h1><p className="text-muted">Entérate de las últimas novedades deportivas de San Miguel.</p><QuickCreate type="news" /></div>
    <div className="row g-3 mb-4"><div className="col-md-8"><label htmlFor="noticia-buscar" className="form-label">Buscar noticias</label><input id="noticia-buscar" type="search" className="form-control" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="col-md-4"><label htmlFor="noticia-categoria" className="form-label">Categoría</label><select id="noticia-categoria" className="form-select" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Todas las categorías</option>{Object.keys(NEWS_CATEGORIES).map((value) => <option key={value}>{value}</option>)}</select></div></div>
    <div className="row g-4">{visible.map((noticia) => <div key={noticia.id} className="col-md-4"><BlogCard noticia={noticia} /></div>)}</div>
    {visible.length === 0 && <p className="text-center text-muted">No hay noticias que coincidan con la búsqueda.</p>}
  </div>;
}
