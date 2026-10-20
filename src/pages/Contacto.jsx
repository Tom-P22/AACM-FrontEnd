import { useState } from "react";

function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    comentario: "",
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mensaje de contacto:", form);
    setEnviado(true);
    setForm({ nombre: "", correo: "", comentario: "" });
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h2 className="h4 fw-bold">Formulario de Contacto</h2>
        <p className="text-muted small">
          ¿Tienes dudas sobre los recintos o las reservas? Escríbenos.
        </p>

        {enviado && (
          <div className="alert alert-success">
            ¡Mensaje enviado correctamente! Te contactaremos pronto.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre Completo *</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              placeholder="Ej: Juan Pérez"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="correo"
              className="form-control"
              placeholder="ejemplo@gmail.com"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Comentario / Consulta *
            </label>
            <textarea
              name="comentario"
              className="form-control"
              rows="4"
              placeholder="Escribe tu mensaje..."
              value={form.comentario}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contacto;
