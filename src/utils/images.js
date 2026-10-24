export const MAX_IMAGE_BYTES = 300 * 1024;
export const MAX_SOURCE_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export function isStoredImage(value) {
  return typeof value === "string" && value.length <= MAX_IMAGE_BYTES * 4 / 3 + 100 &&
    /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value);
}

export function validateImageFile(file) {
  if (!file || !TYPES.includes(file.type)) throw new Error("Selecciona una imagen JPG, PNG o WebP.");
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > MAX_SOURCE_BYTES) throw new Error("La imagen debe pesar entre 1 byte y 5 MB.");
}

export async function readImageFile(file) {
  validateImageFile(file);
  const source = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
  const image = await new Promise((resolve, reject) => {
    const picture = new Image();
    picture.onload = () => resolve(picture);
    picture.onerror = () => reject(new Error("El archivo no contiene una imagen válida."));
    picture.src = source;
  });
  const ratio = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo preparar la imagen.");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  for (const quality of [0.85, 0.7, 0.5]) {
    const result = canvas.toDataURL("image/jpeg", quality);
    if (isStoredImage(result)) return result;
  }
  throw new Error("Selecciona una imagen más pequeña; no se pudo reducir a 300 KB.");
}
