import { useState } from "react";
import { useReservations } from "../context/ReservationContext";
import ImageUpload from "../components/ImageUpload";

function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    comentario: "",
    attachment: "",
  });
  const [result, setResult] = useState(null);
  const { saveMessage } = useReservations();
  const [readingImage, setReadingImage] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setResult(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (readingImage) return;
    const response = saveMessage(form);
    setResult(response);
    if (response.success) setForm({ nombre: "", correo: "", comentario: "", attachment: "" });
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h2 className="h4 fw-bold">Formulario de Contacto</h2>
        <p className="text-muted small">
          ¿Tienes dudas sobre los recintos o las reservas? Escríbenos.
        </p>

        {result && (
          <div className={`alert ${result.success ? "alert-success" : "alert-danger"}`} role="alert">
            {result.success ? `Consulta registrada correctamente. Código: ${result.item.id.slice(0, 8)}.` : result.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="contacto-nombre" className="form-label fw-semibold">Nombre Completo *</label>
            <input
              type="text"
              name="nombre"
              id="contacto-nombre"
              maxLength={100}
              autoComplete="name"
              className="form-control"
              placeholder="Ej: Juan Pérez"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contacto-correo" className="form-label fw-semibold">
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="correo"
              id="contacto-correo"
              maxLength={254}
              autoComplete="email"
              className="form-control"
              placeholder="ejemplo@gmail.com"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contacto-comentario" className="form-label fw-semibold">
              Comentario / Consulta *
            </label>
            <textarea
              name="comentario"
              id="contacto-comentario"
              maxLength={2000}
              className="form-control"
              rows="4"
              placeholder="Escribe tu mensaje..."
              value={form.comentario}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mb-4"><ImageUpload label="Adjuntar foto (opcional)" value={form.attachment} onChange={(attachment) => { setForm((prev) => ({ ...prev, attachment })); setResult(null); }} onBusyChange={setReadingImage} /></div>
          <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={readingImage}>
            {readingImage ? "Preparando foto…" : "Enviar consulta"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contacto;
