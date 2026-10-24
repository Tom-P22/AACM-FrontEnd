function Nosotros() {
  return (
    <div className="container py-5">
      <h2 className="h3 fw-bold border-start border-4 border-info ps-3 mb-4 text-primary">
        Corporación Municipal de Deportes San Miguel
      </h2>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm p-4 text-center">
            <svg viewBox="0 0 64 64" width="64" height="64" className="text-primary mb-3 mx-auto" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 23 32 8l25 15H7Zm3 32h44M7 60h50M13 28v22m13-22v22m12-22v22m13-22v22" /></svg>
            <h3>Nuestra Misión</h3>
            <p className="text-muted">
              Brindar infraestructura deportiva accesible, moderna y de alto
              estándar para todos los vecinos y deportistas de la comuna de San
              Miguel.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 shadow-sm p-4 text-center">
            <svg viewBox="0 0 64 64" width="64" height="64" className="text-primary mb-3 mx-auto" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="32" cy="18" r="9" /><circle cx="12" cy="26" r="7" /><circle cx="52" cy="26" r="7" /><path d="M17 57V47a15 15 0 0 1 30 0v10H17ZM3 55V45a9 9 0 0 1 10-9m48 19V45a9 9 0 0 0-10-9" /></svg>
            <h3>Equipo de Gestión</h3>
            <p className="text-muted">
              Desarrollado por el equipo de profesionales en informática y
              deporte comunal para simplificar el proceso de reserva y arriendo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nosotros;
