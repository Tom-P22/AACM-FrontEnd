import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EXAMPLE_ACCOUNTS } from "../data/accounts.js";
import { hasPermission, roleLabel } from "../utils/permissions.js";

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={hasPermission(user, "admin:access") ? "/admin" : "/perfil"} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    const result = await login(correo, password);
    setSubmitting(false);
    if (result.success) {
      navigate(hasPermission(result.user, "admin:access") ? "/admin" : "/perfil", { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "450px" }}>
        <div className="text-center mb-3">
          <i className="fa-solid fa-user-circle display-4 text-primary"></i>
          <h2 className="h4 fw-bold mt-2">Iniciar Sesión</h2>
          <p className="text-muted small">
            Ingresa a tu cuenta institucional o vecinal
          </p>
        </div>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <form id="form-login" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="login-correo" className="form-label fw-semibold">
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="login-correo"
              className="form-control"
              placeholder="usuario@gmail.com"
              name="correo"
              autoComplete="username"
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
              required
              disabled={submitting}
            />
            <div className="text-danger small mt-1" id="err-login-correo"></div>
          </div>

          <div className="mb-3">
            <label htmlFor="login-password" className="form-label fw-semibold">
              Contraseña *
            </label>
            <input
              type="password"
              id="login-password"
              className="form-control"
              placeholder="••••••••"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={submitting}
            />
            <div
              className="text-danger small mt-1"
              id="err-login-password"
            ></div>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={submitting}>
            {submitting ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
        <details className="border-top pt-3 mt-3 example-accounts">
          <summary className="fw-semibold text-primary">Cuentas de ejemplo</summary>
          <div className="d-grid gap-2 mt-3">{EXAMPLE_ACCOUNTS.map((account) => <div key={account.correo} className="rounded border p-3">
            <span className="badge bg-primary-subtle text-primary mb-2">{roleLabel(account.role)}</span>
            <div className="small">{account.correo}</div><div className="small text-muted">Contraseña: {account.password}</div>
            <button type="button" className="btn btn-outline-primary btn-sm mt-2" disabled={submitting} onClick={() => { setCorreo(account.correo); setPassword(account.password); setError(""); }}>Usar cuenta de {roleLabel(account.role).toLowerCase()}</button>
          </div>)}</div>
        </details>

        <div className="text-center mt-3 small">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="text-primary fw-bold">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
