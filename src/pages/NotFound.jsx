import { Link } from "react-router-dom";

export default function NotFound() {
  return <div className="container py-5 text-center">
    <h1 className="h3">Página no encontrada</h1>
    <p>La dirección que abriste no existe.</p>
    <Link to="/" className="btn btn-primary">Volver al inicio</Link>
  </div>;
}
