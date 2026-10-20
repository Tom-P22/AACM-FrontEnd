function Registro() {
  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "800px" }}>
        <h2 className="h4 fw-bold">Registro de Vecino / Usuario</h2>
        <p className="text-muted small mb-4">
          Completa tus datos para agendar tus horas de cancha
        </p>

        <form id="form-registro" noValidate>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="reg-run" className="form-label fw-semibold">
                RUN (Sin puntos ni guión) *
              </label>
              <input
                type="text"
                id="reg-run"
                className="form-control"
                placeholder="19011022K"
              />
              <div className="text-danger small mt-1" id="err-reg-run"></div>
            </div>

            <div className="col-md-6">
              <label htmlFor="reg-nombre" className="form-label fw-semibold">
                Nombre *
              </label>
              <input
                type="text"
                id="reg-nombre"
                className="form-control"
                placeholder="Juan"
              />
              <div className="text-danger small mt-1" id="err-reg-nombre"></div>
            </div>

            <div className="col-md-6">
              <label htmlFor="reg-apellidos" className="form-label fw-semibold">
                Apellidos *
              </label>
              <input
                type="text"
                id="reg-apellidos"
                className="form-control"
                placeholder="Pérez González"
              />
              <div className="text-danger small mt-1" id="err-reg-apellidos"></div>
            </div>

            <div className="col-md-6">
              <label htmlFor="reg-correo" className="form-label fw-semibold">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="reg-correo"
                className="form-control"
                placeholder="juan.perez@gmail.com"
              />
              <div className="text-danger small mt-1" id="err-reg-correo"></div>
            </div>

            <div className="col-md-6">
              <label htmlFor="reg-fecha-nac" className="form-label fw-semibold">
                Fecha de Nacimiento
              </label>
              <input type="date" id="reg-fecha-nac" className="form-control" />
            </div>

            <div className="col-md-6">
              <label htmlFor="reg-tipo-usuario" className="form-label fw-semibold">
                Tipo de Usuario *
              </label>
              <select id="reg-tipo-usuario" className="form-select">
                <option value="Cliente">Cliente (Vecino)</option>
                <option value="Vendedor">Vendedor (Encargado Recinto)</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="reg-region" className="form-label fw-semibold">
                Región *
              </label>
              <select id="reg-region" className="form-select">
                <option value="">-- Seleccione Región --</option>
              </select>
              <div className="text-danger small mt-1" id="err-reg-region"></div>
            </div>

            <div className="col-md-6">
              <label htmlFor="reg-comuna" className="form-label fw-semibold">
                Comuna *
              </label>
              <select id="reg-comuna" className="form-select">
                <option value="">-- Seleccione Comuna --</option>
              </select>
              <div className="text-danger small mt-1" id="err-reg-comuna"></div>
            </div>

            <div className="col-12">
              <label htmlFor="reg-direccion" className="form-label fw-semibold">
                Dirección *
              </label>
              <input
                type="text"
                id="reg-direccion"
                className="form-control"
                placeholder="Av. José Miguel Carrera 1234"
              />
              <div className="text-danger small mt-1" id="err-reg-direccion"></div>
            </div>

            <div className="col-md-6">
              <label htmlFor="reg-password" className="form-label fw-semibold">
                Contraseña *
              </label>
              <input
                type="password"
                id="reg-password"
                className="form-control"
                placeholder="Mínimo 4 caracteres"
              />
              <div className="text-danger small mt-1" id="err-reg-password"></div>
            </div>

            <div className="col-md-6">
              <label
                htmlFor="reg-confirm-password"
                className="form-label fw-semibold"
              >
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                id="reg-confirm-password"
                className="form-control"
                placeholder="Repite la contraseña"
              />
              <div
                className="text-danger small mt-1"
                id="err-reg-confirm-password"
              ></div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold mt-4">
            Registrar Cuenta
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registro;