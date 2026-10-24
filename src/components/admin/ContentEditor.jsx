import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import { IMAGE_OPTIONS, NEWS_CATEGORIES } from "../../data/news.js";
import { PRODUCT_CATEGORIES } from "../../utils/content.js";
import { localDate } from "../../utils/reservations.js";
import ImageUpload from "../ImageUpload";

export default function ContentEditor({ type, initialRecord, onClose, onSaved }) {
  const content = useContent();
  const isProduct = type === "products";
  const [form, setForm] = useState(() => initialRecord || (isProduct
    ? { nombre: "", categoria: "Implementos", precio: "", stock: 10, descripcion: "", imagen: IMAGE_OPTIONS[0][0] }
    : { titulo: "", categoria: "Comunidad", texto: "", imagen: "/img/ConcursoTenis.jpg", fecha: localDate() }));
  const [message, setMessage] = useState(null);
  const [readingImage, setReadingImage] = useState(false);
  const change = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value, ...(name === "categoria" && isProduct && !prev.id ? { stock: value === "Canchas" ? 1 : 10 } : {}) }));
    setMessage(null);
  };
  const submit = (event) => {
    event.preventDefault();
    if (readingImage) return;
    const result = isProduct ? content.saveProduct({ ...form, precio: Number(form.precio), stock: Number(form.stock) }) : content.saveNews(form);
    if (result.success) onSaved();
    else setMessage(result.message);
  };
  return <>
    {message && <p className="alert alert-danger" role="alert">{message}</p>}
    <form className="card shadow-sm border-0 p-4 mb-4 admin-editor" onSubmit={submit}>
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
        {isProduct && <div className="col-md-4"><label htmlFor="contenido-stock" className="form-label">Stock por horario *</label><input id="contenido-stock" name="stock" type="number" min="0" max={form.categoria === "Canchas" ? 1 : 999} step="1" className="form-control" value={form.stock} onChange={change} required /></div>}
        <div className={isProduct ? "col-md-4" : "col-md-8"}><label htmlFor="contenido-imagen" className="form-label">Imagen *</label>
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
      <div className="d-flex gap-2 mt-4"><button className="btn btn-primary" type="submit" disabled={readingImage}>Guardar cambios</button><button className="btn btn-outline-secondary" type="button" onClick={onClose} disabled={readingImage}>Cancelar edición</button></div>
    </form>
  </>;
}
