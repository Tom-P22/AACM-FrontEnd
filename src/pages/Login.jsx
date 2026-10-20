import { Link } from "react-router-dom";

function Login() {
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

        <form id="form-login" noValidate>
          <div className="mb-3">
            <label htmlFor="login-correo" className="form-label fw-semibold">
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="login-correo"
              className="form-control"
              placeholder="usuario@gmail.com"
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
            />
            <div
              className="text-danger small mt-1"
              id="err-login-password"
            ></div>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Ingresar
          </button>
        </form>

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