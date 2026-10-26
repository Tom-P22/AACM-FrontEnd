import { test } from "vitest";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { EXAMPLE_ACCOUNTS } from "../src/data/accounts.js";
import { seedExampleAccounts } from "../src/utils/seedAccounts.js";
import { createLocalAuth } from "../src/utils/localAuth.js";
import { hasPermission, roleLabel } from "../src/utils/permissions.js";
import { DEFAULT_AVATAR, validAvatar } from "../src/utils/avatar.js";
import { memoryStorage } from "./helpers.js";

test("cuentas predefinidas se crean sin iniciar sesión ni guardar contraseñas legibles", async () => {
  const storage = memoryStorage();
  const state = await seedExampleAccounts(storage, webcrypto);
  assert.equal(state.user, null);
  assert.equal(state.users.length, 3);
  assert.equal(storage.getItem("user_deportes"), null);
  for (const account of EXAMPLE_ACCOUNTS) {
    assert.ok(!storage.getItem("users_deportes").includes(account.password));
    assert.equal((await createLocalAuth(storage, webcrypto).login(account.correo, account.password)).user.role, account.role);
  }
});
test("recargar cuentas de ejemplo conserva la sesión y no duplica cuentas", async () => {
  const storage = memoryStorage();
  await seedExampleAccounts(storage, webcrypto);
  const auth = createLocalAuth(storage, webcrypto);
  const signed = await auth.login(EXAMPLE_ACCOUNTS[2].correo, EXAMPLE_ACCOUNTS[2].password);
  await auth.updateProfile(signed.user.id, { nombre: "Vecino Actualizado" });
  const reloaded = await seedExampleAccounts(storage, webcrypto);
  assert.equal(reloaded.user.id, signed.user.id);
  assert.equal(reloaded.user.nombre, "Vecino Actualizado");
  assert.equal(reloaded.users.length, 3);
});
test("sembrar ejemplos nunca eleva permisos de una cuenta existente con el mismo correo", async () => {
  const storage = memoryStorage();
  const auth = createLocalAuth(storage, webcrypto);
  await auth.register({ ...EXAMPLE_ACCOUNTS[0], run: "123456785", confirmPassword: EXAMPLE_ACCOUNTS[0].password,
    fechaNac: "1990-01-01", region: "Región Metropolitana de Santiago", comuna: "San Miguel", direccion: "Calle 123" });
  const state = await seedExampleAccounts(storage, webcrypto);
  assert.equal(state.users.find((item) => item.correo === EXAMPLE_ACCOUNTS[0].correo).role, "user");
});
test("matriz de permisos separa administrador, editor y usuario", () => {
  assert.equal(hasPermission({ role: "admin" }, "products:write"), true);
  assert.equal(hasPermission({ role: "admin" }, "users:read"), true);
  assert.equal(hasPermission({ role: "editor" }, "admin:access"), true);
  assert.equal(hasPermission({ role: "editor" }, "news:write"), true);
  assert.equal(hasPermission({ role: "editor" }, "products:write"), false);
  assert.equal(hasPermission({ role: "editor" }, "reservations:manage"), false);
  for (const role of ["user", "desconocido", "__proto__", "constructor", null, {}, ["admin"]]) {
    assert.equal(hasPermission({ role }, "admin:access"), false);
  }
  assert.equal(hasPermission(null, "news:write"), false);
  assert.equal(roleLabel("constructor"), "Usuario");
});
test("foto de perfil acepta imagen y avatar local, rechaza SVG activo y tamaños excesivos", () => {
  assert.equal(validAvatar(DEFAULT_AVATAR), true);
  assert.equal(validAvatar("data:image/png;base64,aGVsbG8="), true);
  assert.equal(validAvatar("https://example.com/avatar.png"), true);
  assert.equal(validAvatar("data:image/svg+xml;base64,aGVsbG8="), false);
  assert.equal(validAvatar("javascript:alert(1)"), false);
  assert.equal(validAvatar("data:image/png;base64," + "A".repeat(500000)), false);
});
test("foto de perfil se guarda y reaparece al recuperar la sesión", async () => {
  const storage = memoryStorage();
  const auth = createLocalAuth(storage, webcrypto);
  const created = await auth.register({ ...EXAMPLE_ACCOUNTS[2], confirmPassword: EXAMPLE_ACCOUNTS[2].password,
    fechaNac: "1990-01-01", region: "Región Metropolitana de Santiago", comuna: "San Miguel", direccion: "Calle 123" });
  const photo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jf7kAAAAASUVORK5CYII=";
  await auth.updateProfile(created.user.id, { avatar: photo, role: "admin" });
  const loaded = await createLocalAuth(storage, webcrypto).load();
  assert.equal(loaded.user.avatar, photo);
  assert.equal(loaded.user.role, "user");
  await assert.rejects(auth.updateProfile(created.user.id, { avatar: "javascript:alert(1)" }), /foto/);
});
