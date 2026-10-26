import { EXAMPLE_ACCOUNTS } from "../data/accounts.js";
import { createLocalAuth } from "./localAuth.js";
import { readJson, writeJson } from "./storage.js";

export async function seedExampleAccounts(storage, crypto) {
  // Preparar todo en memoria evita iniciar una sesión al crear las cuentas
  // y permite guardar los verificadores de contraseña en una sola escritura.
  const original = readJson(storage, "users_deportes", []);
  const memory = new Map([["users_deportes", JSON.stringify(original)]]);
  const staged = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: (key) => memory.delete(key),
  };
  const auth = createLocalAuth(staged, crypto);
  let state = await auth.load();
  for (const example of EXAMPLE_ACCOUNTS) {
    // Nunca promover ni sobrescribir una cuenta existente con el mismo correo/RUT.
    if (state.users.some((account) => account.correo === example.correo || account.run === example.run)) continue;
    const created = await auth.register({
      ...example, confirmPassword: example.password, fechaNac: "1990-01-01",
      region: "Región Metropolitana de Santiago", comuna: "San Miguel",
      direccion: "Dirección de ejemplo 123", deporteFavorito: "Fútbol",
    });
    const accounts = readJson(staged, "users_deportes", []);
    writeJson(staged, "users_deportes", accounts.map((account) => account.id === created.user.id
      ? { ...account, role: example.role, seeded: true } : account));
    state = await auth.load();
  }
  const next = readJson(staged, "users_deportes", []);
  if (JSON.stringify(original) !== JSON.stringify(next)) writeJson(storage, "users_deportes", next);
  return createLocalAuth(storage, crypto).load();
}
