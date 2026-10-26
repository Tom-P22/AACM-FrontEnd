import { test } from "vitest";
import assert from "node:assert/strict";
import { isStoredImage, validateImageFile } from "../src/utils/images.js";
import { createContentStore } from "../src/utils/content.js";
import { memoryStorage } from "./helpers.js";

const photo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jf7kAAAAASUVORK5CYII=";
test("adjuntos admiten fotos limitadas y rechazan contenido activo", () => {
  assert.equal(isStoredImage(photo), true);
  for (const value of ["data:image/svg+xml;base64,AAAA", "javascript:alert(1)", "data:image/png;base64," + "A".repeat(500000), null]) assert.equal(isStoredImage(value), false);
});
test("selección de imagen rechaza formatos y tamaños no admitidos", () => {
  assert.doesNotThrow(() => validateImageFile({ type: "image/jpeg", size: 1000 }));
  for (const file of [{ type: "image/svg+xml", size: 100 }, { type: "image/png", size: 0 }, { type: "image/jpeg", size: 6000000 }]) assert.throws(() => validateImageFile(file));
});
test("productos y noticias conservan imágenes subidas al recargar", () => {
  const storage = memoryStorage(); const store = createContentStore(storage); const admin = { role: "admin" };
  store.saveProduct(admin, { ...store.load().products[0], imagen: photo });
  store.saveNews(admin, { ...store.load().news[0], imagen: photo });
  const loaded = createContentStore(storage).load();
  assert.equal(loaded.products[0].imagen, photo); assert.equal(loaded.news[0].imagen, photo);
});
