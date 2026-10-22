function Productos() {
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 className="h3 fw-bold m-0">
          Catálogo de Canchas y Artículos Deportivos
        </h2>
        <select id="filter-category" className="form-select w-auto">
          <option value="ALL">Todas las Categorías</option>
          <option value="Canchas">Canchas Deportivas</option>
          <option value="Implementos">Implementos Deportivos</option>
          <option value="Indumentaria">Indumentaria y Petos</option>
        </select>
      </div>

      <div className="row g-4" id="catalog-products-list"></div>
    </div>
  );
}

export default Productos;