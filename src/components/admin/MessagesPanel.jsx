import { useState } from "react";
import { useReservations } from "../../context/ReservationContext";
import { useAuth } from "../../context/AuthContext";
import { MESSAGE_STATUSES } from "../../utils/reservations.js";
import { filterMessages } from "../../utils/filters.js";
import Dialog from "../Dialog";

export default function MessagesPanel() {
  const { messages, updateMessageStatus } = useReservations(); const { can } = useAuth();
  const [query, setQuery] = useState(""); const [status, setStatus] = useState(""); const [photo, setPhoto] = useState(null); const [notice, setNotice] = useState(null);
  const visible = filterMessages(messages, { query, status });
  const update = (id, next) => { const result = updateMessageStatus(id, next); setNotice({ success: result.success, text: result.success ? "Estado de consulta actualizado." : result.message }); };
  return <>
    <h2 className="h4 fw-bold mb-4">Consultas recibidas</h2>
    <div className="row g-3 mb-4"><div className="col-md-8"><label htmlFor="consulta-buscar" className="form-label">Buscar por vecino, correo o contenido</label><input id="consulta-buscar" className="form-control" type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
      <div className="col-md-4"><label htmlFor="consulta-filtrar" className="form-label">Estado</label><select id="consulta-filtrar" className="form-select" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos los estados</option>{Object.entries(MESSAGE_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div></div>
    {notice && <p className={`alert ${notice.success ? "alert-success" : "alert-danger"}`} role="alert">{notice.text}</p>}
    <p className="small text-muted">{visible.length} consultas</p>
    {visible.length === 0 && <p className="text-muted">No hay consultas que coincidan con los filtros.</p>}
    {[...visible].reverse().map((message) => <article key={message.id} className="card border-0 shadow-sm mb-3 p-4">
      <div className="d-flex justify-content-between gap-3 flex-wrap"><div><h3 className="h6 fw-bold">{message.nombre}</h3><p className="small text-muted">{message.correo} · {new Date(message.createdAt).toLocaleString("es-CL")}</p></div>
        <div><label htmlFor={`consulta-${message.id}`} className="visually-hidden">Estado de consulta de {message.nombre}</label><select id={`consulta-${message.id}`} className="form-select form-select-sm" value={message.status} disabled={!can("messages:manage")} onChange={(event) => update(message.id, event.target.value)}>{Object.entries(MESSAGE_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div></div>
      <p className="mb-0" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{message.comentario}</p>
      {message.attachment && <button className="btn btn-outline-primary btn-sm mt-3 align-self-start" onClick={() => setPhoto(message.attachment)}>Ver foto adjunta</button>}
    </article>)}
    {photo && <Dialog title="Foto adjunta a la consulta" onClose={() => setPhoto(null)}><img src={photo} alt="Foto adjunta del vecino" className="img-fluid rounded" /></Dialog>}
  </>;
}
