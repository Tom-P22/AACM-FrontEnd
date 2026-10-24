import { REGIONES_COMUNAS } from "../data/products.js";
import { normalizarRut, validarCorreo, validarMayorDeEdad, validarNombre, validarPassword, validarRut } from "./validations.js";
import { DEFAULT_AVATAR, validAvatar } from "./avatar.js";

const ACCOUNTS_KEY = "users_deportes";
const SESSION_KEY = "user_deportes";
const ITERATIONS = 600000;
const editableFields = ["nombre", "apellidos", "correo", "region", "comuna", "direccion", "telefono", "deporteFavorito", "avatar"];
const clean = (value) => typeof value === "string" ? value.trim() : "";
const normalizeEmail = (value) => clean(value).toLowerCase();

function publicAccount(account) {
  return Object.fromEntries(Object.entries(account).filter(([key]) =>
    !["password", "confirmPassword", "credential"].includes(key)
  ));
}

function profileData(data) {
  return Object.fromEntries(editableFields.map((key) => [key, clean(data[key])])
    .map(([key, value]) => [key, key === "correo" ? normalizeEmail(value) : value]));
}

function validateProfile(data) {
  if (!validAvatar(data.avatar)) throw new Error("Selecciona una foto PNG, JPG o WebP de hasta 300 KB.");
  if (!validarNombre(data.nombre) || !validarNombre(data.apellidos)) {
    throw new Error("Revisa el nombre y los apellidos: solo pueden contener letras y espacios.");
  }
  if (!validarCorreo(data.correo)) throw new Error("Usa un correo @gmail.com, @admin.com o @duoc.cl.");
  if (!REGIONES_COMUNAS[data.region]?.includes(data.comuna)) throw new Error("Selecciona una región y una comuna válidas.");
  if (!data.direccion) throw new Error("La dirección es obligatoria.");
  if (data.telefono && (!/^\+?[\d\s()-]{8,20}$/.test(data.telefono) || data.telefono.replace(/\D/g, "").length < 8)) throw new Error("Revisa el formato del teléfono.");
}

function hex(bytes) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function passwordHash(password, salt, crypto) {
  if (!crypto?.subtle) throw new Error("Abre el sitio mediante HTTPS o localhost para usar las cuentas de prueba.");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({
    name: "PBKDF2", hash: "SHA-256", iterations: ITERATIONS,
    salt: Uint8Array.from(salt.match(/.{2}/g), (byte) => Number.parseInt(byte, 16)),
  }, key, 256);
  return hex(bits);
}

async function createCredential(password, crypto) {
  if (!crypto?.subtle) throw new Error("Abre el sitio mediante HTTPS o localhost para usar las cuentas de prueba.");
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  return { salt, hash: await passwordHash(password, salt, crypto) };
}

// Adaptador de prueba local. La autorización real debe implementarse en el backend.
export function createLocalAuth(storage, crypto) {
  const read = (key, fallback) => {
    let raw;
    try { raw = storage.getItem(key); }
    catch { throw new Error("No se pudo acceder a las cuentas guardadas. Revisa los permisos de almacenamiento del navegador."); }
    try { return raw === null ? fallback : JSON.parse(raw); }
    catch { throw new Error("Los datos de acceso guardados están dañados. Usa otro perfil del navegador o restablece los datos del sitio."); }
  };
  const write = (key, value) => {
    try { storage.setItem(key, JSON.stringify(value)); }
    catch { throw new Error("No se pudieron guardar los cambios. Revisa el espacio y los permisos del navegador."); }
  };
  const readAccounts = async () => {
    const accounts = read(ACCOUNTS_KEY, []);
    if (!Array.isArray(accounts) || accounts.some((account) =>
      !account || typeof account !== "object" ||
      !["string", "number"].includes(typeof account.id) ||
      typeof account.correo !== "string" || typeof account.run !== "string" ||
      (typeof account.password !== "string" &&
        (!/^[a-f0-9]{32}$/.test(account.credential?.salt) || !/^[a-f0-9]{64}$/.test(account.credential?.hash)))
    )) throw new Error("Las cuentas guardadas tienen un formato inválido. Restablece los datos del sitio para continuar.");

    let migrated = false;
    const normalized = [];
    for (const account of accounts) {
      const next = { ...publicAccount(account), correo: normalizeEmail(account.correo), run: normalizarRut(account.run) };
      next.credential = typeof account.password === "string"
        ? await createCredential(account.password, crypto) : account.credential;
      if ("password" in account || "confirmPassword" in account || next.correo !== account.correo || next.run !== account.run) migrated = true;
      normalized.push(next);
    }
    if (migrated) write(ACCOUNTS_KEY, normalized);
    return normalized;
  };
  const snapshot = (accounts, user) => ({ users: accounts.map(publicAccount), user: user ? publicAccount(user) : null });
  const setSession = (account) => write(SESSION_KEY, { id: account.id });

  const operations = {
    async load() {
      const accounts = await readAccounts();
      let saved;
      // Una sesión dañada no debe impedir acceder al formulario de inicio de sesión.
      try { saved = read(SESSION_KEY, null); } catch { saved = null; }
      const user = accounts.find((account) => account.id === saved?.id) || null;
      if (user) setSession(user);
      else if (saved !== null) storage.removeItem(SESSION_KEY);
      return snapshot(accounts, user);
    },
    async register(data) {
      const profile = profileData(data);
      validateProfile(profile);
      if (!validarRut(data.run)) throw new Error("El RUT no es válido.");
      if (!validarMayorDeEdad(data.fechaNac)) throw new Error("Debes tener al menos 18 años y una fecha de nacimiento válida.");
      if (!validarPassword(data.password)) throw new Error("La contraseña debe tener al menos 4 caracteres y una mayúscula.");
      if (data.password !== data.confirmPassword) throw new Error("Las contraseñas no coinciden.");
      const accounts = await readAccounts();
      const run = normalizarRut(data.run);
      if (accounts.some((account) => account.correo === profile.correo)) throw new Error("Este correo ya está registrado.");
      if (accounts.some((account) => account.run === run)) throw new Error("Este RUT ya está registrado.");
      const credential = await createCredential(data.password, crypto);
      const account = {
        ...profile, avatar: profile.avatar || DEFAULT_AVATAR, id: crypto.randomUUID(), run, fechaNac: data.fechaNac, role: "user",
        createdAt: new Date().toISOString(), credential,
      };
      const next = [...accounts, account];
      write(ACCOUNTS_KEY, next);
      setSession(account);
      return snapshot(next, account);
    },
    async login(correo, password) {
      const accounts = await readAccounts();
      const account = accounts.find((item) => item.correo === normalizeEmail(correo));
      if (!account || typeof password !== "string" ||
        await passwordHash(password, account.credential.salt, crypto) !== account.credential.hash) {
        throw new Error("Correo o contraseña incorrectos.");
      }
      setSession(account);
      return snapshot(accounts, account);
    },
    async updateProfile(id, data) {
      const accounts = await readAccounts();
      const account = accounts.find((item) => item.id === id);
      if (!account) throw new Error("Tu sesión ya no está disponible. Vuelve a iniciar sesión.");
      const profile = profileData({ ...account, ...Object.fromEntries(editableFields
        .filter((key) => Object.hasOwn(data, key)).map((key) => [key, data[key]])) });
      validateProfile(profile);
      if (accounts.some((item) => item.id !== id && item.correo === profile.correo)) throw new Error("Este correo ya está registrado.");
      const updated = { ...account, ...profile };
      const next = accounts.map((item) => item.id === id ? updated : item);
      write(ACCOUNTS_KEY, next);
      return snapshot(next, updated);
    },
    logout() {
      try { storage.removeItem(SESSION_KEY); }
      catch { throw new Error("No se pudo cerrar la sesión guardada. Revisa los permisos del navegador."); }
    },
  };

  // Serializa lecturas y cambios asíncronos para evitar registros duplicados
  // o pérdida de cambios dentro de la misma instancia del adaptador.
  let queue = Promise.resolve();
  return Object.fromEntries(Object.entries(operations).map(([name, operation]) => [
    name, name === "logout" ? operation : (...args) => {
      const result = queue.then(() => operation(...args));
      queue = result.catch(() => {});
      return result;
    },
  ]));
}
