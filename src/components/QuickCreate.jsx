import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Dialog from "./Dialog";
import ContentEditor from "./admin/ContentEditor";

export default function QuickCreate({ type }) {
  const { can } = useAuth(); const [open, setOpen] = useState(false); const [saved, setSaved] = useState(false);
  const isProduct = type === "products";
  if (!can(isProduct ? "products:write" : "news:write")) return null;
  const title = isProduct ? "Agregar producto" : "Publicar noticia";
  return <div>
    <button className="btn btn-primary fw-semibold" onClick={() => { setSaved(false); setOpen(true); }}><span aria-hidden="true">＋</span> {title}</button>
    {saved && <p className="small text-success mt-2 mb-0" role="status">{isProduct ? "Producto agregado al catálogo." : "Noticia publicada."}</p>}
    {open && <Dialog title={title} onClose={() => setOpen(false)}><ContentEditor type={type} onClose={() => setOpen(false)} onSaved={() => { setOpen(false); setSaved(true); }} /></Dialog>}
  </div>;
}
