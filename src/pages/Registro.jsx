import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { REGIONES_COMUNAS } from "../data/products";
import { useAuth } from "../context/AuthContext";

function Registro() {
  const [form, setForm] = useState({
    run: "",
    nombre: "",
    apellidos: "",
    correo: "",
    fechaNac: "",
    region: "",
    comuna: "",
    direccion: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const comunas = form.region ? REGIONES_COMUNAS[form.region] || [] : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "region" ? { comuna: "" } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    const result = register(form);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "800px" }}>
        <h2 className="h4 fw-bold">Registro de Vecino / Usuario</h2>
        <p className="text-muted small mb-4">
          Completa tus datos para agendar tus horas de cancha
        </p>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                RUN (Sin puntos ni guión) *
              </label>
              <input
                type="text"
                name="run"
                className="form-control"
                placeholder="19011022K"
                value={form.run}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Nombre *</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                placeholder="Juan"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Apellidos *</label>
              <input
                type="text"
                name="apellidos"
                className="form-control"
                placeholder="Pérez González"
                value={form.apellidos}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="correo"
                className="form-control"
                placeholder="juan.perez@gmail.com"
                value={form.correo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="fechaNac"
                className="form-control"
                value={form.fechaNac}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Región *</label>
              <select
                name="region"
                className="form-select"
                value={form.region}
                onChange={handleChange}
                required
              >
                <option value="">-- Seleccione Región --</option>
                {Object.keys(REGIONES_COMUNAS).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Comuna *</label>
              <select
                name="comuna"
                className="form-select"
                value={form.comuna}
                onChange={handleChange}
                required
                disabled={!form.region}
              >
                <option value="">-- Seleccione Comuna --</option>
                {comunas.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Dirección *</label>
              <input
                type="text"
                name="direccion"
                className="form-control"
                placeholder="Av. José Miguel Carrera 1234"
                value={form.direccion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Contraseña *</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Mínimo 4 caracteres"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Repite la contraseña"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold mt-4">
            Registrar Cuenta
          </button>
        </form>

        <div className="text-center mt-3 small">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-primary fw-bold">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Registro;