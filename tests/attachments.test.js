import { test } from "vitest";
import assert from "node:assert/strict";
import { createReservationStore } from "../src/utils/reservations.js";
import { memoryStorage } from "./helpers.js";
test("consultas conservan el adjunto y permiten consultas sin foto", () => {
  const storage = memoryStorage(); let id = 0; const store = createReservationStore(storage, { uuid: () => String(++id) });
  const photo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jf7kAAAAASUVORK5CYII=";
  const data = { nombre: "Ana", correo: "ana@gmail.com", comentario: "Consulta con fotografía" };
  store.saveMessage({ ...data, attachment: photo }); store.saveMessage(data);
  const restored = createReservationStore(storage).listMessages();
  assert.equal(restored[0].attachment, photo); assert.equal(restored[1].attachment, "");
  assert.throws(() => store.saveMessage({ ...data, attachment: "data:image/svg+xml;base64,AAAA" }), /foto/);
});
