
function Contacto() {
  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h2 className="h4 fw-bold">Formulario de Contacto</h2>
        <p className="text-muted small">
          ¿Tienes dudas sobre los recintos o las reservas? Escríbenos.
        </p>

        <form id="form-contacto" noValidate>
          <div className="mb-3">
            <label htmlFor="contact-nombre" className="form-label fw-semibold">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="contact-nombre"
              className="form-control"
              placeholder="Ej: Juan Pérez"
            />
            <div className="text-danger small mt-1" id="err-contact-nombre"></div>
          </div>

          <div className="mb-3">
            <label htmlFor="contact-correo" className="form-label fw-semibold">
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="contact-correo"
              className="form-control"
              placeholder="ejemplo@gmail.com"
            />
            <div className="text-danger small mt-1" id="err-contact-correo"></div>
          </div>

          <div className="mb-3">
            <label htmlFor="contact-comentario" className="form-label fw-semibold">
              Comentario / Consulta *
            </label>
            <textarea
              id="contact-comentario"
              className="form-control"
              rows="4"
              placeholder="Escribe tu mensaje..."
            ></textarea>
            <div className="text-danger small mt-1" id="err-contact-comentario"></div>
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