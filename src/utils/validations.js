/**
 * Valida RUT chileno (con o sin puntos/guión).
 * Algoritmo del dígito verificador módulo 11.
 */
export function validarRut(rut) {
  if (!rut || typeof rut !== "string") return false;

  // Limpiar: quitar puntos, guiones y espacios
  let limpio = rut.replace(/\./g, "").replace(/-/g, "").replace(/\s/g, "").toUpperCase();

  if (limpio.length < 2) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  if (!/^\d+$/.test(cuerpo)) return false;
  if (!/^[\dK]$/.test(dv)) return false;

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = 11 - (suma % 11);
  let dvEsperado;
  if (resto === 11) dvEsperado = "0";
  else if (resto === 10) dvEsperado = "K";
  else dvEsperado = String(resto);

  return dv === dvEsperado;
}

/**
 * Normaliza RUT a formato sin puntos ni guión, mayúsculas (ej: 19011022K)
 */
export function normalizarRut(rut) {
  return rut.replace(/\./g, "").replace(/-/g, "").replace(/\s/g, "").toUpperCase();
}

/**
 * Correo obligatorio:
 * - @gmail.com  o  @admin.com  o  @duoc.cl
 */
export function validarCorreo(correo) {
  if (!correo || typeof correo !== "string") return false;
  const c = correo.trim().toLowerCase();

  const patrones = [
    /^[a-z0-9._%+-]+@gmail\.com$/,
    /^[a-z0-9._%+-]+@admin\.com$/,
    /^[a-z0-9._%+-]+@duoc\.cl$/,
  ];

  return patrones.some((re) => re.test(c));
}

/**
 * Fecha de nacimiento: debe tener al menos 18 años (no futuros, no menores).
 */
export function validarMayorDeEdad(fechaNac) {
  if (!fechaNac) return false;

  const nacimiento = new Date(fechaNac + "T00:00:00");
  if (Number.isNaN(nacimiento.getTime())) return false;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // No permitir fechas futuras
  if (nacimiento > hoy) return false;

  // Calcular edad
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad >= 18;
}

/**
 * Fecha máxima permitida en el input (hace exactamente 18 años)
 */
export function fechaMaxima18Anos() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split("T")[0];
}

/**
 * Contraseña: mínimo 4 caracteres y al menos una mayúscula
 */
export function validarPassword(password) {
  if (!password || password.length < 4) return false;
  return /[A-Z]/.test(password);
}

/**
 * Nombre/apellido: no vacío y solo letras (permite espacios y acentos)
 */
export function validarNombre(texto) {
  if (!texto || !texto.trim()) return false;
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(texto.trim());
}
