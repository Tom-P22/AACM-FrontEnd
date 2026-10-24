import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import ContentEditor from "./ContentEditor";
import { formatCLP } from "../../utils/format.js";

export default function ContentManager({ type }) {
  const content = useContent();
  const isProduct = type === "products";
  const title = isProduct ? "Productos y canchas" : "Noticias";
  const records = isProduct ? content.products : content.news;
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState(null);
  const toggle = (id) => {
    const result = isProduct ? content.toggleProduct(id) : content.toggleNews(id);
    setMessage({ success: result.success, text: result.success ? "Estado actualizado." : result.message });
  };

  return <>
    <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-4">
      <div><h2 className="h4 fw-bold mb-1">{title}</h2><p className="text-muted mb-0">Agrega, edita y organiza el contenido del sitio.</p></div>
      <button className="btn btn-primary fw-semibold" onClick={() => { setForm({}); setMessage(null); }}><i className="fa-solid fa-plus me-2"></i>{isProduct ? "Agregar producto" : "Publicar noticia"}</button>
    </div>
    {message && <p className={`alert ${message.success ? "alert-success" : "alert-danger"}`} role="alert">{message.text}</p>}
    {form && <ContentEditor key={form.id || "new"} type={type} initialRecord={form.id ? form : null} onClose={() => setForm(null)} onSaved={() => { setForm(null); setMessage({ success: true, text: "Cambios guardados correctamente." }); }} />}
    <div className="card shadow-sm border-0 overflow-hidden"><div className="table-responsive">
      <table className="table align-middle mb-0 admin-table">
        <thead className="table-light"><tr><th scope="col">{isProduct ? "Producto" : "Noticia"}</th><th scope="col">Categoría</th><th scope="col">{isProduct ? "Precio" : "Fecha"}</th>{isProduct && <th scope="col">Stock</th>}<th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>
        <tbody>{records.map((record) => <tr key={record.id}>
          <td><div className="d-flex align-items-center gap-3"><img src={record.imagen} alt="" className="admin-thumbnail rounded" /><span className="fw-semibold">{isProduct ? record.nombre : record.titulo}</span></div></td>
          <td>{record.categoria}</td><td className="text-nowrap">{isProduct ? formatCLP(record.precio) : record.fecha}</td>
          {isProduct && <td>{record.stock}</td>}
          <td><span className={`badge ${record.active === false ? "bg-secondary-subtle text-secondary" : "bg-success-subtle text-success"}`}>{record.active === false ? "Archivado" : "Publicado"}</span></td>
          <td><div className="d-flex gap-2"><button className="btn btn-sm btn-outline-primary" onClick={() => { setForm({ ...record }); setMessage(null); }}>Editar</button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => toggle(record.id)}>{record.active === false ? "Restaurar" : "Archivar"}</button></div></td>
        </tr>)}</tbody>
      </table>
    </div></div>
  </>;
}
