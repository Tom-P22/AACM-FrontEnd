import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { REGIONES_COMUNAS } from "../data/products";
import Avatar from "../components/Avatar";
import { DEFAULT_AVATAR, MAX_AVATAR_BYTES } from "../utils/avatar.js";
import { roleLabel } from "../utils/permissions.js";

function ProfileForm({ user, updateProfile }) {
  const [form, setForm] = useState(() => ({
    nombre: user.nombre || "", apellidos: user.apellidos || "", correo: user.correo || "",
    region: user.region || "", comuna: user.comuna || "", direccion: user.direccion || "",
    telefono: user.telefono || "", deporteFavorito: user.deporteFavorito || "",
    avatar: user.avatar || DEFAULT_AVATAR,
  }));
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [readingPhoto, setReadingPhoto] = useState(false);
  const [editing, setEditing] = useState(false);
  const reset = () => {
    setForm(Object.fromEntries(Object.keys(form).map((key) => [key, user[key] || (key === "avatar" ? DEFAULT_AVATAR : "")])));
    setMessage(null);
  };

  const selectPhoto = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > MAX_AVATAR_BYTES) {
      setMessage({ success: false, text: "Selecciona una foto PNG, JPG o WebP de hasta 300 KB." });
      return;
    }
    setReadingPhoto(true);
    const reader = new FileReader();
    reader.onload = () => { setForm((prev) => ({ ...prev, avatar: reader.result })); setMessage(null); setReadingPhoto(false); };
    reader.onerror = () => { setMessage({ success: false, text: "No se pudo leer la foto." }); setReadingPhoto(false); };
    reader.readAsDataURL(file);
  };

  const change = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value, ...(name === "region" ? { comuna: "" } : {}) }));
    setMessage(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage(null);
    const result = await updateProfile(form);
    setSaving(false);
    setMessage({ success: result.success, text: result.success ? "Perfil actualizado correctamente." : result.message });
    if (result.success) {
      setForm((prev) => Object.fromEntries(Object.keys(prev).map((key) => [key, result.user[key] || ""])));
      setEditing(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "800px" }}>
        <h1 className="h4 fw-bold">Mi perfil</h1>
        <p className="text-muted">Tu información personal y tus datos de contacto.</p>
        <div className="bg-light rounded p-3 mb-4">
          <div><strong>RUT:</strong> {user.run}</div>
          <div><strong>Fecha de nacimiento:</strong> {user.fechaNac || "Sin registrar"}</div>
        </div>

        {message && <div className={`alert ${message.success ? "alert-success" : "alert-danger"}`} role="alert">{message.text}</div>}

        {!editing && <>
          <div className="d-flex align-items-center gap-3 flex-wrap mb-4">
            <Avatar src={user.avatar} name={user.nombre} size={104} />
            <div className="flex-grow-1"><h2 className="h5 fw-bold mb-1">{user.nombre} {user.apellidos}</h2><span className="badge bg-primary-subtle text-primary">{roleLabel(user.role)}</span></div>
            <button className="btn btn-primary" onClick={() => { reset(); setEditing(true); }}>Editar perfil</button>
          </div>
          <dl className="row g-3 mb-0">
            {[["Correo", user.correo], ["Región", user.region], ["Comuna", user.comuna], ["Dirección", user.direccion], ["Teléfono", user.telefono], ["Deporte favorito", user.deporteFavorito]].map(([label, value]) =>
              <div key={label} className="col-md-6"><dt className="small text-muted fw-normal">{label}</dt><dd className="fw-semibold mb-1" style={{ overflowWrap: "anywhere" }}>{value || "Sin registrar"}</dd></div>)}
          </dl>
        </>}
        {editing && <form onSubmit={submit}>
          <fieldset disabled={saving || readingPhoto}>
            <div className="d-flex align-items-center gap-4 flex-wrap border-bottom pb-4 mb-4">
              <Avatar src={form.avatar} name={user.nombre} size={104} />
              <div className="flex-grow-1">
                <h2 className="h5 fw-bold mb-1">{user.nombre} {user.apellidos}</h2>
                <span className="badge bg-primary-subtle text-primary mb-2">{roleLabel(user.role)}</span>
                <label htmlFor="perfil-foto" className="form-label d-block small">Foto de perfil</label>
                <input id="perfil-foto" type="file" accept="image/png,image/jpeg,image/webp" className="form-control form-control-sm" onChange={selectPhoto} />
                <div className="d-flex align-items-center gap-3 mt-2"><small className="text-muted">PNG, JPG o WebP · Máximo 300 KB</small>
                  <button type="button" className="btn btn-link btn-sm p-0" onClick={() => { setForm((prev) => ({ ...prev, avatar: DEFAULT_AVATAR })); setMessage(null); }}>Restablecer foto</button>
                </div>
              </div>
            </div>
            <div className="row g-3">
              {[
                ["nombre", "Nombre", "text", "given-name"],
                ["apellidos", "Apellidos", "text", "family-name"],
                ["correo", "Correo electrónico", "email", "email"],
              ].map(([name, label, type, autoComplete]) => (
                <div className="col-md-6" key={name}>
                  <label htmlFor={`perfil-${name}`} className="form-label fw-semibold">{label} *</label>
                  <input id={`perfil-${name}`} name={name} type={type} autoComplete={autoComplete}
                    className="form-control" value={form[name]} onChange={change} required />
                </div>
              ))}
              <div className="col-md-6">
                <label htmlFor="perfil-region" className="form-label fw-semibold">Región *</label>
                <select id="perfil-region" name="region" className="form-select" value={form.region} onChange={change} required>
                  <option value="">Selecciona una región</option>
                  {Object.keys(REGIONES_COMUNAS).map((region) => <option key={region}>{region}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="perfil-comuna" className="form-label fw-semibold">Comuna *</label>
                <select id="perfil-comuna" name="comuna" className="form-select" value={form.comuna} onChange={change} required disabled={!form.region}>
                  <option value="">Selecciona una comuna</option>
                  {(REGIONES_COMUNAS[form.region] || []).map((comuna) => <option key={comuna}>{comuna}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="perfil-direccion" className="form-label fw-semibold">Dirección *</label>
                <input id="perfil-direccion" name="direccion" autoComplete="street-address" className="form-control" value={form.direccion} onChange={change} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="perfil-telefono" className="form-label fw-semibold">Teléfono</label>
                <input id="perfil-telefono" name="telefono" type="tel" autoComplete="tel" className="form-control" placeholder="+56 9 1234 5678" value={form.telefono} onChange={change} />
              </div>
              <div className="col-md-6">
                <label htmlFor="perfil-deporte" className="form-label fw-semibold">Deporte favorito</label>
                <input id="perfil-deporte" name="deporteFavorito" className="form-control" value={form.deporteFavorito} onChange={change} />
              </div>
            </div>
            <button className="btn btn-primary fw-bold mt-4" type="submit">{saving ? "Guardando…" : "Guardar cambios"}</button>
            <button className="btn btn-outline-secondary mt-4 ms-2" type="button" onClick={() => { reset(); setEditing(false); }}>Cancelar</button>
          </fieldset>
        </form>}
        <Link to="/mis-reservas" className="mt-3">Ver mis reservas</Link>
        <Link to="/productos" className="mt-3">Ir al catálogo</Link>
      </div>
    </div>
  );
}

export default function Perfil() {
  const { user, updateProfile } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <ProfileForm key={user.id} user={user} updateProfile={updateProfile} />;
}
