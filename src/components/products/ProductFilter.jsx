function ProductFilter({ value, onChange }) {
  return (
    <select
      className="form-select w-auto"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="ALL">Todas las Categorías</option>
      <option value="Canchas">Canchas Deportivas</option>
      <option value="Implementos">Implementos Deportivos</option>
      <option value="Indumentaria">Indumentaria y Petos</option>
    </select>
  );
}

export default ProductFilter;
