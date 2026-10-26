// Adaptador inyectable: las pruebas usan memoria y la aplicación usa localStorage.
export const browserStorage = {
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
  removeItem: (key) => window.localStorage.removeItem(key),
};

export function readJson(storage, key, fallback) {
  try {
    const saved = storage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch {
    throw new Error("No se pudieron leer los datos guardados. Revisa el almacenamiento del navegador.");
  }
}

export function writeJson(storage, key, value) {
  try { storage.setItem(key, JSON.stringify(value)); }
  catch { throw new Error("No se pudieron guardar los cambios. Revisa el espacio y los permisos del navegador."); }
}
