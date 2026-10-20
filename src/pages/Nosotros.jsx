function Nosotros() {
  return (
    <div className="container py-5">
      <h2 className="h3 fw-bold border-start border-4 border-info ps-3 mb-4 text-primary">
        Corporación Municipal de Deportes San Miguel
      </h2>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm p-4 text-center">
            <i className="fa-solid fa-building-columns text-primary display-4 mb-3"></i>
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
            <i className="fa-solid fa-people-group text-primary display-4 mb-3"></i>
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
