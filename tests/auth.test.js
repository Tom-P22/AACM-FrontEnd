import { test } from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { createLocalAuth } from "../src/utils/localAuth.js";
import { fechaMaxima18Anos, validarMayorDeEdad, validarRut } from "../src/utils/validations.js";

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

const accountData = (overrides = {}) => ({
  nombre: "José", apellidos: "Pérez", correo: "jose@gmail.com", run: "12.345.678-5",
  fechaNac: "1990-05-12", region: "Región Metropolitana de Santiago", comuna: "San Miguel",
  direccion: "Avenida Principal 123", password: "Clave123", confirmPassword: "Clave123",
  ...overrides,
});

test("registro, sesión persistente, cierre e ingreso sin distinguir mayúsculas del correo", async () => {
  const storage = memoryStorage();
  const auth = createLocalAuth(storage, webcrypto);
  const result = await auth.register(accountData({ correo: " JOSE@GMAIL.COM ", role: "admin" }));
  assert.equal(result.user.correo, "jose@gmail.com");
  assert.equal(result.user.run, "123456785");
  assert.equal(result.user.role, "user");
  assert.equal((await createLocalAuth(storage, webcrypto).load()).user.id, result.user.id);
  for (const user of [result.user, ...result.users]) {
    assert.equal(user.password, undefined);
    assert.equal(user.confirmPassword, undefined);
    assert.equal(user.credential, undefined);
  }
  assert.ok(!storage.getItem("users_deportes").includes("Clave123"));
  assert.deepEqual(JSON.parse(storage.getItem("user_deportes")), { id: result.user.id });
  auth.logout();
  assert.equal((await auth.load()).user, null);
  await assert.rejects(auth.login("jose@gmail.com", "Equivocada"), /incorrectos/);
  await assert.rejects(auth.login("nadie@gmail.com", "Clave123"), /incorrectos/);
  assert.equal((await auth.login(" JOSE@GMAIL.COM ", "Clave123")).user.id, result.user.id);
});

test("rechaza correo y RUT duplicados aunque tengan otro formato", async () => {
  const auth = createLocalAuth(memoryStorage(), webcrypto);
  await auth.register(accountData());
  await assert.rejects(auth.register(accountData({ correo: " JOSE@GMAIL.COM " })), /correo ya/);
  await assert.rejects(auth.register(accountData({ correo: "otro@gmail.com", run: "12345678-5" })), /RUT ya/);
});

test("registros simultáneos no duplican cuentas ni pierden registros", async () => {
  const auth = createLocalAuth(memoryStorage(), webcrypto);
  const attempts = await Promise.allSettled([
    auth.register(accountData()), auth.register(accountData()),
    auth.register(accountData({ correo: "otro@gmail.com", run: "11.111.111-1" })),
  ]);
  assert.equal(attempts.filter((attempt) => attempt.status === "fulfilled").length, 2);
  assert.equal(attempts[1].status, "rejected");
  assert.equal((await auth.load()).users.length, 2);
});

test("validaciones de registro también se aplican fuera del formulario", async () => {
  const storage = memoryStorage();
  const auth = createLocalAuth(storage, webcrypto);
  for (const invalid of [
    { run: "0-0" }, { fechaNac: "2000-02-31" }, { fechaNac: "2020-01-01" },
    { password: "abcd", confirmPassword: "abcd" }, { confirmPassword: "otra" },
    { nombre: "123" }, { correo: "jose@example.com" }, { comuna: "Comuna inexistente" },
    { direccion: " " },
  ]) await assert.rejects(auth.register(accountData(invalid)));
  assert.equal(storage.getItem("users_deportes"), null);
});

test("edita perfil y persiste sin permitir cambios de rol, RUT, ID ni contraseña", async () => {
  const storage = memoryStorage();
  const auth = createLocalAuth(storage, webcrypto);
  const original = (await auth.register(accountData())).user;
  const updated = (await auth.updateProfile(original.id, {
    nombre: "Ana", correo: " ANA@DUOC.CL ", telefono: "+56 9 1234 5678",
    role: "admin", id: "otro", run: "111111111", password: "OtraClave",
    fechaNac: "2020-01-01", credential: {},
  })).user;
  assert.equal(updated.nombre, "Ana");
  assert.equal(updated.correo, "ana@duoc.cl");
  assert.equal(updated.role, "user");
  assert.equal(updated.id, original.id);
  assert.equal(updated.run, original.run);
  assert.equal(updated.fechaNac, original.fechaNac);
  assert.equal((await createLocalAuth(storage, webcrypto).load()).user.nombre, "Ana");
  auth.logout();
  await assert.rejects(auth.login("ana@duoc.cl", "OtraClave"), /incorrectos/);
  assert.equal((await auth.login("ana@duoc.cl", "Clave123")).user.nombre, "Ana");
});

test("edición rechaza correo ocupado, comuna incorrecta y teléfono sin dígitos", async () => {
  const auth = createLocalAuth(memoryStorage(), webcrypto);
  const first = (await auth.register(accountData())).user;
  await auth.register(accountData({ correo: "otro@gmail.com", run: "11.111.111-1" }));
  await assert.rejects(auth.updateProfile(first.id, { correo: " OTRO@GMAIL.COM " }), /correo ya/);
  await assert.rejects(auth.updateProfile(first.id, { region: "Región del Biobío" }), /comuna/);
  await assert.rejects(auth.updateProfile(first.id, { telefono: "--------" }), /teléfono/);
  await assert.rejects(auth.updateProfile("desconocido", {}), /sesión/);
});

test("migra cuentas anteriores sin guardar contraseñas legibles ni duplicarlas en sesión", async () => {
  const legacy = { ...accountData(), id: 42, role: "user" };
  const storage = memoryStorage({ users_deportes: JSON.stringify([legacy]), user_deportes: JSON.stringify(legacy) });
  const auth = createLocalAuth(storage, webcrypto);
  const loaded = await auth.load();
  assert.equal(loaded.user.id, 42);
  const [saved] = JSON.parse(storage.getItem("users_deportes"));
  assert.equal(saved.password, undefined);
  assert.equal(saved.confirmPassword, undefined);
  assert.equal(saved.credential.hash.length, 64);
  assert.deepEqual(JSON.parse(storage.getItem("user_deportes")), { id: 42 });
  assert.equal((await auth.login("jose@gmail.com", "Clave123")).user.id, 42);
});

test("sesión inexistente o dañada no autentica y permite volver a ingresar", async () => {
  const storage = memoryStorage();
  const auth = createLocalAuth(storage, webcrypto);
  await auth.register(accountData());
  for (const session of ["{invalido", JSON.stringify({ id: "inventado", role: "admin" }), "null", "[]"]) {
    storage.setItem("user_deportes", session);
    assert.equal((await auth.load()).user, null);
  }
  assert.equal((await auth.login("jose@gmail.com", "Clave123")).user.role, "user");
});

test("cuentas dañadas se informan sin sobrescribir los datos existentes", async () => {
  for (const value of ["{invalido", "null", "{}", "[null]", '[{"id":1}]']) {
    const storage = memoryStorage({ users_deportes: value });
    const auth = createLocalAuth(storage, webcrypto);
    await assert.rejects(auth.load(), /dañados|inválido/);
    await assert.rejects(auth.register(accountData()), /dañados|inválido/);
    assert.equal(storage.getItem("users_deportes"), value);
  }
});

test("fallos de almacenamiento y ausencia de Web Crypto devuelven errores comprensibles", async () => {
  const denied = { getItem() { throw new Error("denied"); } };
  await assert.rejects(createLocalAuth(denied, webcrypto).load(), /almacenamiento/);
  const full = { ...memoryStorage(), setItem() { throw new Error("quota"); } };
  await assert.rejects(createLocalAuth(full, webcrypto).register(accountData()), /guardar/);
  await assert.rejects(createLocalAuth(memoryStorage(), {}).register(accountData()), /HTTPS/);
});

test("rechaza RUT cero, dígitos incorrectos y fechas imposibles; acepta años bisiestos", () => {
  assert.equal(validarRut("0-0"), false);
  assert.equal(validarRut("12.345.678-9"), false);
  assert.equal(validarRut("12.345.678-5"), true);
  assert.equal(validarRut("10.000.013-k"), true);
  assert.equal(validarMayorDeEdad("2000-02-31"), false);
  assert.equal(validarMayorDeEdad("2001-02-29"), false);
  assert.equal(validarMayorDeEdad("2000-02-29"), true);
  assert.equal(validarMayorDeEdad("2099-01-01"), false);
});

test("el límite de nacimiento coincide con la edad mínima y usa la fecha local", () => {
  const limit = fechaMaxima18Anos();
  const now = new Date();
  assert.ok(limit.startsWith(String(now.getFullYear() - 18)));
  assert.equal(validarMayorDeEdad(limit), true);
  const next = new Date(limit + "T00:00:00");
  next.setDate(next.getDate() + 1);
  const tomorrow = [next.getFullYear(), String(next.getMonth() + 1).padStart(2, "0"), String(next.getDate()).padStart(2, "0")].join("-");
  assert.equal(validarMayorDeEdad(tomorrow), false);
});
