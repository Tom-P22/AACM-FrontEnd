import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom no reproduce la capa modal, el foco ni el diseño de un navegador real.
// Solo representamos el estado abierto/cerrado para probar el flujo de React.
Object.defineProperties(HTMLDialogElement.prototype, {
  showModal: { configurable: true, value() { this.open = true; } },
  close: { configurable: true, value() { this.open = false; } },
});

afterEach(() => cleanup());
