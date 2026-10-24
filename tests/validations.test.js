import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizarRut, validarCorreo, validarMayorDeEdad, validarNombre, validarPassword, validarRut } from "../src/utils/validations.js";
import { formatCLP } from "../src/utils/format.js";

test("RUT con dígito verificador numérico correcto", () => assert.equal(validarRut("12.345.678-5"), true));
test("RUT admite verificador K minúscula", () => assert.equal(validarRut("10.000.013-k"), true));
test("RUT rechaza dígito verificador incorrecto", () => assert.equal(validarRut("12.345.678-9"), false));
test("RUT rechaza cero, cuerpo corto, letras y ausencia de dato", () => {
  for (const value of ["0-0", "1-9", "abcdef-k", null, ""]) assert.equal(validarRut(value), false);
});
test("normalización de RUT elimina puntos, guion y espacios", () => assert.equal(normalizarRut(" 10.000.013-k "), "10000013K"));
test("correos permitidos se validan con espacios y mayúsculas", () => {
  for (const value of [" UNO@GMAIL.COM ", "a@admin.com", "a@duoc.cl"]) assert.equal(validarCorreo(value), true);
});
test("correo rechaza dominios ajenos e intentos de agregar sufijos", () => {
  for (const value of ["a@example.com", "a@gmail.com.ejemplo.cl", "@gmail.com", "a@@duoc.cl", null]) assert.equal(validarCorreo(value), false);
});
test("nombre admite acentos y apellidos con espacios", () => assert.equal(validarNombre(" José Pérez Muñoz "), true));
test("nombre rechaza números, símbolos y texto vacío", () => {
  for (const value of ["Juan123", "<script>", "  ", "", 123, {}, null]) assert.equal(validarNombre(value), false);
});
test("contraseña respeta mínimo y mayúscula existentes", () => {
  assert.equal(validarPassword("Abcd"), true);
  for (const value of ["Abc", "abcd", "", null, 123, {}]) assert.equal(validarPassword(value), false);
});
test("fecha imposible y fecha no ISO se rechazan", () => {
  for (const value of ["2000-02-31", "2001-02-29", "12/05/1990", "1990-13-01", "", null]) assert.equal(validarMayorDeEdad(value), false);
});
test("fecha bisiesta válida de un adulto se admite", () => assert.equal(validarMayorDeEdad("2000-02-29"), true));
test("fecha futura y menor de edad se rechazan", () => {
  assert.equal(validarMayorDeEdad("2999-01-01"), false);
  const today = new Date();
  assert.equal(validarMayorDeEdad(`${today.getFullYear()}-01-01`), false);
});
test("formato monetario representa pesos chilenos sin decimales", () => assert.equal(formatCLP(35000), "$35.000"));
