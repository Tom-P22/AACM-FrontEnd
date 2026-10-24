import { useId, useState } from "react";
import { readImageFile } from "../utils/images.js";

export default function ImageUpload({ value, onChange, onBusyChange, label = "Subir imagen", removeValue = "", disabled = false }) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const select = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError(""); setBusy(true); onBusyChange?.(true);
    try { onChange(await readImageFile(file)); }
    catch (failure) { setError(failure.message); }
    finally { setBusy(false); onBusyChange?.(false); }
  };
  return <div>
    <label className="form-label" htmlFor={id}>{label}</label>
    <input id={id} type="file" accept="image/jpeg,image/png,image/webp" className="form-control" disabled={disabled || busy} onChange={select} />
    <small className="text-muted d-block mt-1">JPG, PNG o WebP · Hasta 5 MB; se optimiza antes de guardar.</small>
    {busy && <p className="small mt-2" role="status">Preparando imagen…</p>}
    {error && <p className="text-danger small mt-2" role="alert">{error}</p>}
    {value && <div className="d-flex align-items-center gap-3 mt-3">
      <img src={value} alt="Vista previa de la imagen" className="rounded upload-preview" style={{ width: 120, height: 90, objectFit: "cover" }} />
      <button className="btn btn-outline-secondary btn-sm" type="button" disabled={disabled || busy || value === removeValue} onClick={() => { onChange(removeValue); setError(""); }}>Quitar imagen</button>
    </div>}
  </div>;
}
