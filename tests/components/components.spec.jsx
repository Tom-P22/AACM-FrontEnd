import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

// Los componentes y sus estados son reales; los contextos aíslan la persistencia.
const mocks = vi.hoisted(() => ({ auth: {}, content: {}, reservations: {} }));
vi.mock("../../src/context/AuthContext.jsx", () => ({ useAuth: () => mocks.auth }));
vi.mock("../../src/context/ContentContext.jsx", () => ({ useContent: () => mocks.content }));
vi.mock("../../src/context/ReservationContext.jsx", () => ({ useReservations: () => mocks.reservations }));

const renderPage = (element) => render(element, { wrapper: MemoryRouter });
const product = { id: 4, nombre: "Balón de fútbol", categoria: "Implementos", imagen: "/img/BalonFutbolN5.jpg", precio: 3000, stock: 3, quantity: 1 };
const booking = { id: "reserva-001", customerName: "Vecino Ejemplo", date: "2099-01-04", time: "11:00", status: "confirmada", items: [product], subtotal: 3000, discount: 0, total: 3000, durationMinutes: 60 };
const summary = { subtotal: 3000, discount: 0, total: 3000, couponInput: "", setCouponInput: () => {}, onApplyCoupon: () => {}, onCheckout: () => {} };

describe("DSY1104 — diez pruebas unitarias de componentes React con Vitest", () => {
  beforeEach(() => {
    mocks.auth = { user: null, can: () => false };
    mocks.content = { products: [], news: [] };
    mocks.reservations = { saveMessage: vi.fn() };
  });

  it("01 renderiza todas las reservas y sus artículos recibidos por props", () => {
    renderPage(<ReservationList reservations={[booking, { ...booking, id: "reserva-002", items: [{ ...product, id: 5, nombre: "Petos deportivos" }] }]} />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(2);
    expect(within(cards[0]).getByText(/Petos deportivos/)).toBeInTheDocument();
    expect(within(cards[1]).getByText(/Balón de fútbol/)).toBeInTheDocument();
    for (const card of cards) expect(within(card).getByText("Total: $3.000")).toBeInTheDocument();
  });

  it("02 muestra el mensaje de error del cupón solo cuando existe", () => {
    const { rerender } = renderPage(<CartSummary {...summary} couponMsg="" />);
    expect(screen.queryByText("Cupón inválido")).not.toBeInTheDocument();
    rerender(<CartSummary {...summary} couponMsg="Cupón inválido" discountApplied={false} />);
    expect(screen.getByText("Cupón inválido")).toHaveClass("text-danger");
    rerender(<CartSummary {...summary} couponMsg="" />);
    expect(screen.queryByText("Cupón inválido")).not.toBeInTheDocument();
  });

  it("03 respeta el título, la etiqueta y el callback de la confirmación", async () => {
    const user = userEvent.setup();
    const confirm = vi.fn(); const close = vi.fn();
    renderPage(<ConfirmDialog title="Archivar producto" confirmLabel="Sí, archivar" onConfirm={confirm} onClose={close}>Se conservará el historial.</ConfirmDialog>);
    const dialog = screen.getByRole("dialog", { name: "Archivar producto" });
    expect(dialog).toHaveAttribute("open");
    expect(within(dialog).getByText("Se conservará el historial.")).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Sí, archivar" }));
    expect(confirm).toHaveBeenCalledTimes(1); expect(close).not.toHaveBeenCalled();
  });

  it("04 actualiza el estado del formulario de contacto y entrega los datos al guardar", async () => {
    const user = userEvent.setup();
    const save = mocks.reservations.saveMessage.mockReturnValue({ success: true, item: { id: "consulta-001" } });
    renderPage(<Contacto />);
    await user.type(screen.getByLabelText(/Nombre Completo/), "Vecino Ejemplo");
    await user.type(screen.getByLabelText(/Correo Electrónico/), "vecino@gmail.com");
    await user.type(screen.getByLabelText(/Comentario \/ Consulta/), "Consulta sobre las canchas.");
    expect(screen.getByLabelText(/Nombre Completo/)).toHaveValue("Vecino Ejemplo");
    await user.click(screen.getByRole("button", { name: "Enviar consulta" }));
    expect(save).toHaveBeenCalledExactlyOnceWith({ nombre: "Vecino Ejemplo", correo: "vecino@gmail.com", comentario: "Consulta sobre las canchas.", attachment: "" });
    expect(screen.getByRole("alert")).toHaveTextContent("Consulta registrada correctamente");
    expect(screen.getByLabelText(/Nombre Completo/)).toHaveValue("");
  });

  it("05 emite cambios de cantidad y eliminación y deshabilita aumentar al llegar al stock", async () => {
    const user = userEvent.setup();
    const quantity = vi.fn(); const remove = vi.fn();
    const { rerender } = renderPage(<CartItem item={product} onQuantityChange={quantity} onRemove={remove} />);
    await user.click(screen.getByRole("button", { name: /^Aumentar cantidad/ }));
    expect(quantity).toHaveBeenCalledExactlyOnceWith(product, 2);
    await user.click(screen.getByRole("button", { name: "Quitar" }));
    expect(remove).toHaveBeenCalledExactlyOnceWith(4);
    rerender(<CartItem item={{ ...product, quantity: 3 }} onQuantityChange={quantity} onRemove={remove} />);
    const increase = screen.getByRole("button", { name: /^Aumentar cantidad/ });
    expect(increase).toBeDisabled();
    await user.click(increase);
    expect(quantity).toHaveBeenCalledTimes(1);
  });

  it("06 permite editar el perfil y descartar cambios sin guardar", async () => {
    const user = userEvent.setup();
    const update = vi.fn();
    mocks.auth = { user: { id: "vecino", nombre: "Vicente", apellidos: "Vecino", correo: "vecino@gmail.com", role: "user", deporteFavorito: "Fútbol" }, updateProfile: update };
    renderPage(<Perfil />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Editar perfil" }));
    await user.clear(screen.getByLabelText("Deporte favorito"));
    await user.type(screen.getByLabelText("Deporte favorito"), "Tenis");
    expect(screen.getByLabelText("Deporte favorito")).toHaveValue("Tenis");
    await user.click(screen.getByRole("button", { name: "Cancelar", exact: true }));
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByText("Fútbol")).toBeInTheDocument(); expect(update).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Editar perfil" }));
    expect(screen.getByLabelText("Deporte favorito")).toHaveValue("Fútbol");
  });

  it("07 filtra noticias al escribir sin tildes y excluye las archivadas", async () => {
    const user = userEvent.setup();
    mocks.content.news = [
      { id: 1, titulo: "Clínica de fútbol", texto: "Entrenamiento comunitario", categoria: "Comunidad", fecha: "2026-10-01", imagen: product.imagen },
      { id: 2, titulo: "Torneo de tenis", texto: "Inscripciones abiertas", categoria: "Comunidad", fecha: "2026-10-02", imagen: product.imagen },
      { id: 3, titulo: "Clínica archivada", texto: "Noticia anterior", categoria: "Comunidad", fecha: "2026-10-03", imagen: product.imagen, active: false },
    ];
    renderPage(<Blogs />);
    expect(screen.getByRole("heading", { name: "Clínica de fútbol" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Torneo de tenis" })).toBeInTheDocument();
    expect(screen.queryByText("Clínica archivada")).not.toBeInTheDocument();
    await user.type(screen.getByLabelText("Buscar noticias"), "clinica");
    expect(screen.getByRole("heading", { name: "Clínica de fútbol" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Torneo de tenis" })).not.toBeInTheDocument();
    await user.clear(screen.getByLabelText("Buscar noticias"));
    await user.type(screen.getByLabelText("Buscar noticias"), "inexistente");
    expect(screen.getByText(/No hay noticias que coincidan/)).toBeInTheDocument();
  });

  it("08 muestra los accesos rápidos según el permiso de cada rol", () => {
    const { rerender } = renderPage(<><QuickCreate type="products" /><QuickCreate type="news" /></>);
    for (const role of ["user", "editor", "admin"]) {
      mocks.auth = { can: (permission) => hasPermission({ role }, permission) };
      rerender(<><QuickCreate type="products" /><QuickCreate type="news" /></>);
      expect(!!screen.queryByRole("button", { name: /Agregar producto/ }), role).toBe(role === "admin");
      expect(!!screen.queryByRole("button", { name: /Publicar noticia/ }), role).toBe(role !== "user");
    }
  });

  it("09 convierte precio y stock del editor y solo anuncia éxito cuando se guarda", async () => {
    const user = userEvent.setup();
    const save = vi.fn().mockReturnValue({ success: false, message: "Sin espacio para guardar" });
    const saved = vi.fn(); mocks.content.saveProduct = save;
    renderPage(<ContentEditor type="products" onSaved={saved} onClose={() => {}} />);
    await user.type(screen.getByLabelText(/^Nombre/), "Set de entrenamiento");
    await user.type(screen.getByLabelText(/Precio en CLP/), "4500");
    await user.clear(screen.getByLabelText(/Stock por horario/));
    await user.type(screen.getByLabelText(/Stock por horario/), "5");
    await user.type(screen.getByLabelText(/^Descripción/), "Artículos deportivos para entrenamiento.");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(save).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ nombre: "Set de entrenamiento", precio: 4500, stock: 5 }));
    expect(screen.getByRole("alert")).toHaveTextContent("Sin espacio para guardar"); expect(saved).not.toHaveBeenCalled();
    save.mockReturnValue({ success: true });
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(saved).toHaveBeenCalledTimes(1);
  });

  it("10 requiere confirmar la cancelación y Volver conserva la reserva", async () => {
    const user = userEvent.setup(); const cancel = vi.fn();
    renderPage(<ReservationList reservations={[booking]} onCancel={cancel} />);
    await user.click(screen.getByRole("button", { name: "Cancelar reserva", exact: true }));
    expect(cancel).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Volver", exact: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); expect(cancel).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Cancelar reserva", exact: true }));
    await user.click(screen.getByRole("button", { name: "Sí, cancelar reserva" }));
    expect(cancel).toHaveBeenCalledExactlyOnceWith("reserva-001");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
