import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { REGIONES_COMUNAS } from "../data/products";
import { useAuth } from "../context/AuthContext";
import {
  validarRut,
  normalizarRut,
  validarCorreo,
  validarMayorDeEdad,
  fechaMaxima18Anos,
  validarPassword,
  validarNombre,
} from "../utils/validations";

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
  const [errors, setErrors] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const comunas = form.region ? REGIONES_COMUNAS[form.region] || [] : [];
  const maxFechaNac = fechaMaxima18Anos();

  if (isAuthenticated) return <Navigate to="/perfil" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "region" ? { comuna: "" } : {}),
    }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validarFormulario = () => {
    const e = {};

    // RUT
    if (!form.run.trim()) {
      e.run = "El RUT es obligatorio";
    } else if (!validarRut(form.run)) {
      e.run = "RUT inválido. Revisa el dígito verificador";
    }

    // Nombre
    if (!form.nombre.trim()) {
      e.nombre = "El nombre es obligatorio";
    } else if (!validarNombre(form.nombre)) {
      e.nombre = "El nombre solo puede contener letras";
    }

    // Apellidos
    if (!form.apellidos.trim()) {
      e.apellidos = "Los apellidos son obligatorios";
    } else if (!validarNombre(form.apellidos)) {
      e.apellidos = "Los apellidos solo pueden contener letras";
    }

    // Correo
    if (!form.correo.trim()) {
      e.correo = "El correo es obligatorio";
    } else if (!validarCorreo(form.correo)) {
      e.correo =
        "Solo se permiten correos @gmail.com, @admin.com o @duoc.cl";
    }

    // Fecha de nacimiento
    if (!form.fechaNac) {
      e.fechaNac = "La fecha de nacimiento es obligatoria";
    } else if (!validarMayorDeEdad(form.fechaNac)) {
      e.fechaNac = "Debes tener al menos 18 años";
    }

    // Región / comuna / dirección
    if (!form.region) e.region = "Selecciona una región";
    if (!form.comuna) e.comuna = "Selecciona una comuna";
    if (!form.direccion.trim()) e.direccion = "La dirección es obligatoria";

    // Contraseña
    if (!form.password) {
      e.password = "La contraseña es obligatoria";
    } else if (!validarPassword(form.password)) {
      e.password =
        "Mínimo 4 caracteres y al menos una letra mayúscula";
    }

    if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setErrorGeneral("");

    if (!validarFormulario()) return;

    const datos = {
      ...form,
      run: normalizarRut(form.run),
      correo: form.correo.trim().toLowerCase(),
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
    };

    setSubmitting(true);
    const result = await register(datos);
    setSubmitting(false);
    if (result.success) {
      navigate("/perfil", { replace: true });
    } else {
      // Correo o RUT duplicado
      setErrorGeneral(result.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "800px" }}>
        <h2 className="h4 fw-bold">Registro de Vecino / Usuario</h2>
        <p className="text-muted small mb-4">
          Completa tus datos para agendar tus horas de cancha
        </p>

        {errorGeneral && (
          <div className="alert alert-danger py-2" role="alert">{errorGeneral}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <fieldset disabled={submitting}>
          <div className="row g-3">
            {/* RUT */}
            <div className="col-md-6">
              <label htmlFor="registro-run" className="form-label fw-semibold">
                RUN*
              </label>
              <input
                type="text"
                id="registro-run"
                name="run"
                className={`form-control ${errors.run ? "is-invalid" : ""}`}
                placeholder="12.345.678-5"
                value={form.run}
                onChange={handleChange}
              />
              {errors.run && (
                <div className="invalid-feedback d-block">{errors.run}</div>
              )}
            </div>

            {/* Nombre */}
            <div className="col-md-6">
              <label htmlFor="registro-nombre" className="form-label fw-semibold">Nombre *</label>
              <input
                type="text"
                id="registro-nombre"
                name="nombre"
                className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                placeholder="Juan"
                value={form.nombre}
                onChange={handleChange}
              />
              {errors.nombre && (
                <div className="invalid-feedback d-block">{errors.nombre}</div>
              )}
            </div>

            {/* Apellidos */}
            <div className="col-md-6">
              <label htmlFor="registro-apellidos" className="form-label fw-semibold">Apellidos *</label>
              <input
                type="text"
                id="registro-apellidos"
                name="apellidos"
                className={`form-control ${
                  errors.apellidos ? "is-invalid" : ""
                }`}
                placeholder="Pérez González"
                value={form.apellidos}
                onChange={handleChange}
              />
              {errors.apellidos && (
                <div className="invalid-feedback d-block">
                  {errors.apellidos}
                </div>
              )}
            </div>

            {/* Correo */}
            <div className="col-md-6">
              <label htmlFor="registro-correo" className="form-label fw-semibold">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="registro-correo"
                name="correo"
                className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                placeholder="usuario@gmail.com"
                value={form.correo}
                onChange={handleChange}
              />
              {errors.correo && (
                <div className="invalid-feedback d-block">{errors.correo}</div>
              )}
              <small className="text-muted">
                Solo @gmail.com, @admin.com o @duoc.cl
              </small>
            </div>

            {/* Fecha nacimiento */}
            <div className="col-md-6">
              <label htmlFor="registro-fechaNac" className="form-label fw-semibold">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                id="registro-fechaNac"
                name="fechaNac"
                className={`form-control ${
                  errors.fechaNac ? "is-invalid" : ""
                }`}
                max={maxFechaNac}
                value={form.fechaNac}
                onChange={handleChange}
              />
              {errors.fechaNac && (
                <div className="invalid-feedback d-block">
                  {errors.fechaNac}
                </div>
              )}
              <small className="text-muted">Debes tener al menos 18 años</small>
            </div>

            {/* Región */}
            <div className="col-md-6">
              <label htmlFor="registro-region" className="form-label fw-semibold">Región *</label>
              <select
                id="registro-region"
                name="region"
                className={`form-select ${errors.region ? "is-invalid" : ""}`}
                value={form.region}
                onChange={handleChange}
              >
                <option value="">-- Seleccione Región --</option>
                {Object.keys(REGIONES_COMUNAS).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.region && (
                <div className="invalid-feedback d-block">{errors.region}</div>
              )}
            </div>

            {/* Comuna */}
            <div className="col-md-6">
              <label htmlFor="registro-comuna" className="form-label fw-semibold">Comuna *</label>
              <select
                id="registro-comuna"
                name="comuna"
                className={`form-select ${errors.comuna ? "is-invalid" : ""}`}
                value={form.comuna}
                onChange={handleChange}
                disabled={!form.region}
              >
                <option value="">-- Seleccione Comuna --</option>
                {comunas.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.comuna && (
                <div className="invalid-feedback d-block">{errors.comuna}</div>
              )}
            </div>

            {/* Dirección */}
            <div className="col-12">
              <label htmlFor="registro-direccion" className="form-label fw-semibold">Dirección *</label>
              <input
                type="text"
                id="registro-direccion"
                name="direccion"
                className={`form-control ${
                  errors.direccion ? "is-invalid" : ""
                }`}
                placeholder="Av. José Miguel Carrera 1234"
                value={form.direccion}
                onChange={handleChange}
              />
              {errors.direccion && (
                <div className="invalid-feedback d-block">
                  {errors.direccion}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="col-md-6">
              <label htmlFor="registro-password" className="form-label fw-semibold">Contraseña *</label>
              <input
                type="password"
                id="registro-password"
                name="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                placeholder="Mín. 4 caracteres + 1 mayúscula"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="col-md-6">
              <label htmlFor="registro-confirmPassword" className="form-label fw-semibold">
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                id="registro-confirmPassword"
                name="confirmPassword"
                className={`form-control ${
                  errors.confirmPassword ? "is-invalid" : ""
                }`}
                placeholder="Repite la contraseña"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback d-block">
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold mt-4">
            {submitting ? "Creando cuenta…" : "Registrar Cuenta"}
          </button>
          </fieldset>
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
