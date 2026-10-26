export const normalizeSearch = (value) => typeof value === "string" ? value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : "";
export const matchesQuery = (query, values) => normalizeSearch(values.filter((value) => value !== undefined && value !== null).join(" ")).includes(normalizeSearch(query));

export function filterReservations(records, { query = "", date = "", status = "" } = {}) {
  return records.filter((record) => (!date || record.date === date) && (!status || record.status === status) &&
    matchesQuery(query, [record.id, record.customerName, ...record.items.map((item) => item.nombre)]));
}

export function filterMessages(records, { query = "", status = "" } = {}) {
  return records.filter((record) => (!status || record.status === status) && matchesQuery(query, [record.id, record.nombre, record.correo, record.comentario]));
}
