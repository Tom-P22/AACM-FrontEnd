import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import CartItem from "../../src/components/cart/CartItem.jsx";
import CartSummary from "../../src/components/cart/CartSummary.jsx";
import ReservationList from "../../src/components/ReservationList.jsx";
import ConfirmDialog from "../../src/components/ConfirmDialog.jsx";
import QuickCreate from "../../src/components/QuickCreate.jsx";
import ContentEditor from "../../src/components/admin/ContentEditor.jsx";
import Contacto from "../../src/pages/Contacto.jsx";
import Perfil from "../../src/pages/Perfil.jsx";
import Blogs from "../../src/pages/Blogs.jsx";
import { hasPermission } from "../../src/utils/permissions.js";
import { mocks } from "./context-mocks.jsx";

vi.mock("../../src/context/AuthContext", () => import("./context-mocks.jsx"));
vi.mock("../../src/context/ContentContext", () => import("./context-mocks.jsx"));
vi.mock("../../src/context/CartContext", () => import("./context-mocks.jsx"));
vi.mock("../../src/context/ReservationContext", () => import("./context-mocks.jsx"));

describe("DSY1104 — diez pruebas unitarias de componentes React", () => {
  let host;
  let root;
  const product = { id: 4, nombre: "Balón de fútbol", categoria: "Implementos", imagen: "/img/BalonFutbolN5.jpg", precio: 3000, stock: 3, quantity: 1 };
  const booking = { id: "reserva-001", customerName: "Vecino Ejemplo", date: "2099-01-04", time: "11:00", status: "confirmada", items: [product], subtotal: 3000, discount: 0, total: 3000, durationMinutes: 60 };
  const summary = { subtotal: 3000, discount: 0, total: 3000, couponInput: "", setCouponInput: () => {}, onApplyCoupon: () => {}, onCheckout: () => {} };
  const render = async (element) => { await act(async () => root.render(<MemoryRouter>{element}</MemoryRouter>)); };
  const click = async (element) => { expect(element, "Debe existir el control antes de pulsarlo").not.toBeNull(); await act(async () => element.click()); };
  const button = (label) => [...document.querySelectorAll("button")].find((node) => node.textContent.trim() === label);
  const input = async (selector, value) => {
    const element = host.querySelector(selector);
    const prototype = element.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : element.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    await act(async () => {
      Object.getOwnPropertyDescriptor(prototype, "value").set.call(element, value);
      element.dispatchEvent(new Event(element.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
    });
  };

  beforeEach(() => {
    host = document.createElement("div"); document.body.append(host); root = createRoot(host);
    mocks.auth = { user: null, can: () => false };
    mocks.content = { products: [], news: [] };
    mocks.cart = {};
    mocks.reservations = { saveMessage: vi.fn().mockName("saveMessage") };
  });
  afterEach(async () => { await act(async () => root.unmount()); host.remove(); });

  it("01 renderiza todas las reservas y sus artículos recibidos por props", async () => {
    await render(<ReservationList reservations={[booking, { ...booking, id: "reserva-002", items: [{ ...product, id: 5, nombre: "Petos deportivos" }] }]} />);
    const cards = host.querySelectorAll("article");
    expect(cards.length).toBe(2);
    expect(host.textContent).toContain("Balón de fútbol");
    expect(host.textContent).toContain("Petos deportivos");
    expect(host.textContent).toContain("$3.000");
  });

  it("02 muestra el mensaje de error del cupón solo cuando existe", async () => {
    await render(<CartSummary {...summary} couponMsg="" />);
    expect(host.querySelector(".text-danger")).toBeNull();
    await render(<CartSummary {...summary} couponMsg="Cupón inválido" discountApplied={false} />);
    expect(host.querySelector(".text-danger").textContent).toBe("Cupón inválido");
    await render(<CartSummary {...summary} couponMsg="" />);
    expect(host.querySelector(".text-danger")).toBeNull();
  });

  it("03 respeta el título, la etiqueta y el callback de la confirmación", async () => {
    const confirm = vi.fn().mockName("confirmar"); const close = vi.fn().mockName("cerrar");
    await render(<ConfirmDialog title="Archivar producto" confirmLabel="Sí, archivar" onConfirm={confirm} onClose={close}>Se conservará el historial.</ConfirmDialog>);
    const dialog = document.querySelector("dialog");
    expect(dialog.open).toBe(true);
    expect(dialog.textContent).toContain("Archivar producto");
    expect(dialog.textContent).toContain("Se conservará el historial.");
    await click(button("Sí, archivar"));
    expect(confirm).toHaveBeenCalledTimes(1); expect(close).not.toHaveBeenCalled();
  });

  it("04 actualiza el estado del formulario de contacto y entrega los datos al guardar", async () => {
    const save = mocks.reservations.saveMessage.mockReturnValue({ success: true, item: { id: "consulta-001" } });
    await render(<Contacto />);
    await input("#contacto-nombre", "Vecino Ejemplo"); await input("#contacto-correo", "vecino@gmail.com"); await input("#contacto-comentario", "Consulta sobre las canchas.");
    expect(host.querySelector("#contacto-nombre").value).toBe("Vecino Ejemplo");
    await click(button("Enviar consulta"));
    expect(save).toHaveBeenCalledExactlyOnceWith({ nombre: "Vecino Ejemplo", correo: "vecino@gmail.com", comentario: "Consulta sobre las canchas.", attachment: "" });
    expect(host.querySelector('[role="alert"]').textContent).toContain("Consulta registrada correctamente");
    expect(host.querySelector("#contacto-nombre").value).toBe("");
  });

  it("05 emite cambios de cantidad y eliminación y deshabilita aumentar al llegar al stock", async () => {
    const quantity = vi.fn().mockName("cantidad"); const remove = vi.fn().mockName("quitar");
    await render(<CartItem item={product} onQuantityChange={quantity} onRemove={remove} />);
    await click(host.querySelector('[aria-label^="Aumentar"]'));
    expect(quantity).toHaveBeenCalledExactlyOnceWith(product, 2);
    await click(button("Quitar")); expect(remove).toHaveBeenCalledExactlyOnceWith(4);
    await render(<CartItem item={{ ...product, quantity: 3 }} onQuantityChange={quantity} onRemove={remove} />);
    expect(host.querySelector('[aria-label^="Aumentar"]').disabled).toBe(true);
  });

  it("06 permite editar el perfil y descartar cambios sin guardar", async () => {
    const update = vi.fn().mockName("updateProfile");
    mocks.auth = { user: { id: "vecino", nombre: "Vicente", apellidos: "Vecino", correo: "vecino@gmail.com", role: "user", deporteFavorito: "Fútbol" }, updateProfile: update };
    await render(<Perfil />);
    expect(host.querySelector("input")).toBeNull();
    await click(button("Editar perfil")); await input("#perfil-deporte", "Tenis");
    expect(host.querySelector("#perfil-deporte").value).toBe("Tenis");
    await click(button("Cancelar"));
    expect(host.querySelector("input")).toBeNull(); expect(host.textContent).toContain("Fútbol"); expect(update).not.toHaveBeenCalled();
    await click(button("Editar perfil")); expect(host.querySelector("#perfil-deporte").value).toBe("Fútbol");
  });

  it("07 filtra noticias al escribir sin tildes y excluye las archivadas", async () => {
    mocks.content.news = [
      { id: 1, titulo: "Clínica de fútbol", texto: "Entrenamiento comunitario", categoria: "Comunidad", fecha: "2026-10-01", imagen: product.imagen },
      { id: 2, titulo: "Torneo de tenis", texto: "Inscripciones abiertas", categoria: "Comunidad", fecha: "2026-10-02", imagen: product.imagen },
      { id: 3, titulo: "Clínica archivada", texto: "Noticia anterior", categoria: "Comunidad", fecha: "2026-10-03", imagen: product.imagen, active: false },
    ];
    await render(<Blogs />); expect(host.querySelectorAll(".card").length).toBe(2);
    await input("#noticia-buscar", "clinica");
    expect(host.querySelectorAll(".card").length).toBe(1); expect(host.textContent).toContain("Clínica de fútbol"); expect(host.textContent).not.toContain("Clínica archivada");
    await input("#noticia-buscar", "inexistente"); expect(host.textContent).toContain("No hay noticias que coincidan");
  });

  it("08 muestra los accesos rápidos según el permiso de cada rol", async () => {
    for (const role of ["user", "editor", "admin"]) {
      mocks.auth = { can: (permission) => hasPermission({ role }, permission) };
      await render(<><QuickCreate type="products" /><QuickCreate type="news" /></>);
      expect(!!button("＋ Agregar producto"), role).toBe(role === "admin");
      expect(!!button("＋ Publicar noticia"), role).toBe(role !== "user");
    }
  });

  it("09 convierte precio y stock del editor y solo anuncia éxito cuando se guarda", async () => {
    const save = vi.fn().mockName("saveProduct").mockReturnValue({ success: false, message: "Sin espacio para guardar" });
    const saved = vi.fn().mockName("onSaved"); mocks.content.saveProduct = save;
    await render(<ContentEditor type="products" onSaved={saved} onClose={() => {}} />);
    await input("#contenido-nombre", "Set de entrenamiento"); await input("#contenido-valor", "4500"); await input("#contenido-stock", "5"); await input("#contenido-texto", "Artículos deportivos para entrenamiento.");
    await click(button("Guardar cambios"));
    expect(save.mock.lastCall[0]).toEqual(expect.objectContaining({ nombre: "Set de entrenamiento", precio: 4500, stock: 5 }));
    expect(host.querySelector('[role="alert"]').textContent).toBe("Sin espacio para guardar"); expect(saved).not.toHaveBeenCalled();
    save.mockReturnValue({ success: true }); await click(button("Guardar cambios")); expect(saved).toHaveBeenCalledTimes(1);
  });

  it("10 requiere confirmar la cancelación y Volver conserva la reserva", async () => {
    const cancel = vi.fn().mockName("cancelarReserva");
    await render(<ReservationList reservations={[booking]} onCancel={cancel} />);
    await click(button("Cancelar reserva")); expect(cancel).not.toHaveBeenCalled();
    await click(button("Volver")); expect(document.querySelector("dialog")).toBeNull(); expect(cancel).not.toHaveBeenCalled();
    await click(button("Cancelar reserva")); await click(button("Sí, cancelar reserva"));
    expect(cancel).toHaveBeenCalledExactlyOnceWith("reserva-001"); expect(document.querySelector("dialog")).toBeNull();
  });
});
