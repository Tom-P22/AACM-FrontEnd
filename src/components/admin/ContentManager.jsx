import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import { IMAGE_OPTIONS, NEWS_CATEGORIES } from "../../data/news.js";
import { PRODUCT_CATEGORIES } from "../../utils/content.js";
import { localDate } from "../../utils/reservations.js";
import { formatCLP } from "../../utils/format.js";
import ImageUpload from "../ImageUpload";

export default function ContentManager({ type }) {
  const content = useContent();
  const isProduct = type === "products";
  const title = isProduct ? "Productos y canchas" : "Noticias";
  const records = isProduct ? content.products : content.news;
  const blank = () => isProduct
    ? { nombre: "", categoria: "Implementos", precio: "", descripcion: "", imagen: IMAGE_OPTIONS[0][0] }
    : { titulo: "", categoria: "Comunidad", texto: "", imagen: "/img/ConcursoTenis.jpg", fecha: localDate() };
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState(null);
  const [readingImage, setReadingImage] = useState(false);
  const change = (event) => { setForm((prev) => ({ ...prev, [event.target.name]: event.target.value })); setMessage(null); };
  const submit = (event) => {
    event.preventDefault();
    if (readingImage) return;
    const result = isProduct ? content.saveProduct({ ...form, precio: Number(form.precio) }) : content.saveNews(form);
    setMessage({ success: result.success, text: result.success ? "Cambios guardados correctamente." : result.message });
    if (result.success) setForm(null);
  };
  const toggle = (id) => {
    const result = isProduct ? content.toggleProduct(id) : content.toggleNews(id);
    setMessage({ success: result.success, text: result.success ? "Estado actualizado." : result.message });
  };

  return <>
    <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-4">
      <div><h2 className="h4 fw-bold mb-1">{title}</h2><p className="text-muted mb-0">Agrega, edita y organiza el contenido del sitio.</p></div>
      <button className="btn btn-primary fw-semibold" onClick={() => { setForm(blank()); setMessage(null); }}><i className="fa-solid fa-plus me-2"></i>{isProduct ? "Agregar producto" : "Publicar noticia"}</button>
    </div>
    {message && <p className={`alert ${message.success ? "alert-success" : "alert-danger"}`} role="alert">{message.text}</p>}
    {form && <form className="card shadow-sm border-0 p-4 mb-4 admin-editor" onSubmit={submit}>
      <h3 className="h5 fw-bold mb-3">{form.id ? "Editar" : "Nuevo registro"}</h3>
      <div className="row g-3">
        <div className="col-md-8"><label htmlFor="contenido-nombre" className="form-label">{isProduct ? "Nombre" : "Título"} *</label>
          <input id="contenido-nombre" className="form-control" name={isProduct ? "nombre" : "titulo"} value={isProduct ? form.nombre : form.titulo} onChange={change} minLength={isProduct ? 3 : 5} maxLength={isProduct ? 100 : 150} required />
        </div>
        <div className="col-md-4"><label htmlFor="contenido-categoria" className="form-label">Categoría *</label>
          <select id="contenido-categoria" name="categoria" className="form-select" value={form.categoria} onChange={change} disabled={isProduct && !!form.id}>
            {(isProduct ? PRODUCT_CATEGORIES : Object.keys(NEWS_CATEGORIES)).map((category) => <option key={category}>{category}</option>)}
          </select>
        </div>
        <div className="col-md-4"><label htmlFor="contenido-valor" className="form-label">{isProduct ? "Precio en CLP" : "Fecha de publicación"} *</label>
          <input id="contenido-valor" className="form-control" name={isProduct ? "precio" : "fecha"} type={isProduct ? "number" : "date"}
            min={isProduct ? 1 : undefined} max={isProduct ? 10000000 : undefined} step={isProduct ? 1 : undefined}
            value={isProduct ? form.precio : form.fecha} onChange={change} required />
        </div>
        <div className="col-md-8"><label htmlFor="contenido-imagen" className="form-label">Imagen *</label>
          <select id="contenido-imagen" name="imagen" className="form-select" value={form.imagen} onChange={change}>
            {!IMAGE_OPTIONS.some(([path]) => path === form.imagen) && <option value={form.imagen}>Foto subida</option>}
            {IMAGE_OPTIONS.map(([path, label]) => <option key={path} value={path}>{label}</option>)}
          </select>
        </div>
        <div className="col-12"><ImageUpload value={form.imagen} onChange={(imagen) => setForm((prev) => ({ ...prev, imagen }))} onBusyChange={setReadingImage} removeValue={IMAGE_OPTIONS[0][0]} /></div>
        <div className="col-md-9"><label htmlFor="contenido-texto" className="form-label">{isProduct ? "Descripción" : "Contenido de la noticia"} *</label>
          <textarea id="contenido-texto" name={isProduct ? "descripcion" : "texto"} rows={4} className="form-control" minLength={10} maxLength={isProduct ? 1000 : 3000}
            value={isProduct ? form.descripcion : form.texto} onChange={change} required />
        </div>
        <div className="col-md-3 d-flex align-items-end"><img src={form.imagen} alt="Vista previa de la imagen seleccionada" className="content-image-preview rounded" /></div>
      </div>
      <div className="d-flex gap-2 mt-4"><button className="btn btn-primary" type="submit" disabled={readingImage}>Guardar cambios</button><button className="btn btn-outline-secondary" type="button" onClick={() => setForm(null)} disabled={readingImage}>Cancelar edición</button></div>
    </form>}
    <div className="card shadow-sm border-0 overflow-hidden"><div className="table-responsive">
      <table className="table align-middle mb-0 admin-table">
        <thead className="table-light"><tr><th scope="col">{isProduct ? "Producto" : "Noticia"}</th><th scope="col">Categoría</th><th scope="col">{isProduct ? "Precio" : "Fecha"}</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>
        <tbody>{records.map((record) => <tr key={record.id}>
          <td><div className="d-flex align-items-center gap-3"><img src={record.imagen} alt="" className="admin-thumbnail rounded" /><span className="fw-semibold">{isProduct ? record.nombre : record.titulo}</span></div></td>
          <td>{record.categoria}</td><td className="text-nowrap">{isProduct ? formatCLP(record.precio) : record.fecha}</td>
          <td><span className={`badge ${record.active === false ? "bg-secondary-subtle text-secondary" : "bg-success-subtle text-success"}`}>{record.active === false ? "Archivado" : "Publicado"}</span></td>
          <td><div className="d-flex gap-2"><button className="btn btn-sm btn-outline-primary" onClick={() => { setForm({ ...record }); setMessage(null); }}>Editar</button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => toggle(record.id)}>{record.active === false ? "Restaurar" : "Archivar"}</button></div></td>
        </tr>)}</tbody>
      </table>
    </div></div>
  </>;
}
