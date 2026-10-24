import { INITIAL_PRODUCTS } from "../data/products.js";
import { IMAGE_OPTIONS, INITIAL_NEWS, NEWS_CATEGORIES } from "../data/news.js";
import { hasPermission } from "./permissions.js";
import { readJson, writeJson } from "./storage.js";
import { isStoredImage } from "./images.js";

export const CONTENT_KEY = "content_deportes_v1";
export const PRODUCT_CATEGORIES = ["Canchas", "Implementos", "Indumentaria"];
const clean = (value) => typeof value === "string" ? value.trim() : "";
const validImage = (value) => IMAGE_OPTIONS.some(([path]) => path === value) || isStoredImage(value);

function checkProduct(product) {
  if (!product || clean(product.nombre).length < 3 || clean(product.nombre).length > 100) throw new Error("El nombre debe tener entre 3 y 100 caracteres.");
  if (!PRODUCT_CATEGORIES.includes(product.categoria)) throw new Error("Selecciona una categoría de producto válida.");
  if (!Number.isSafeInteger(product.precio) || product.precio <= 0 || product.precio > 10000000) throw new Error("El precio debe ser un entero entre 1 y 10.000.000 de pesos.");
  if (clean(product.descripcion).length < 10 || clean(product.descripcion).length > 1000) throw new Error("La descripción debe tener entre 10 y 1000 caracteres.");
  if (!validImage(product.imagen)) throw new Error("Selecciona una imagen de la galería o sube una foto válida.");
}

function checkNews(news) {
  if (!news || clean(news.titulo).length < 5 || clean(news.titulo).length > 150) throw new Error("El título debe tener entre 5 y 150 caracteres.");
  if (!Object.hasOwn(NEWS_CATEGORIES, news.categoria)) throw new Error("Selecciona una categoría de noticia válida.");
  if (clean(news.texto).length < 10 || clean(news.texto).length > 3000) throw new Error("El texto debe tener entre 10 y 3000 caracteres.");
  if (!validImage(news.imagen)) throw new Error("Selecciona una imagen de la galería o sube una foto válida.");
  const date = new Date(`${news.fecha}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(news.fecha) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== news.fecha) throw new Error("Selecciona una fecha válida para la noticia.");
}

export function createContentStore(storage) {
  const load = () => {
    const state = readJson(storage, CONTENT_KEY, { products: INITIAL_PRODUCTS, news: INITIAL_NEWS });
    if (!state || !Array.isArray(state.products) || !Array.isArray(state.news)) throw new Error("El contenido guardado no tiene un formato válido.");
    const all = [...state.products, ...state.news];
    if (all.some((item) => !item || !Number.isSafeInteger(item.id) || item.id < 1 || (item.active !== undefined && typeof item.active !== "boolean")) ||
      new Set(state.products.map((item) => item.id)).size !== state.products.length || new Set(state.news.map((item) => item.id)).size !== state.news.length) {
      throw new Error("El contenido guardado contiene registros inválidos o repetidos.");
    }
    state.products.forEach(checkProduct);
    state.news.forEach(checkNews);
    return state;
  };
  const authorize = (user, permission) => {
    if (!hasPermission(user, permission)) throw new Error("No tienes permiso para modificar este contenido.");
  };
  const save = (user, field, data, validate, permission) => {
    authorize(user, permission);
    const state = load();
    const records = state[field];
    const existing = data.id === undefined ? null : records.find((item) => item.id === data.id);
    if (data.id !== undefined && !existing) throw new Error("El registro ya no existe.");
    if (field === "products" && existing && existing.categoria !== data.categoria) throw new Error("La categoría de un producto existente no se puede cambiar; crea otro producto para conservar sus reservas.");
    const record = field === "products" ? {
      nombre: clean(data.nombre), categoria: data.categoria, precio: data.precio, descripcion: clean(data.descripcion), imagen: data.imagen,
    } : {
      titulo: clean(data.titulo), categoria: data.categoria, texto: clean(data.texto), imagen: data.imagen,
      fecha: data.fecha, badge: NEWS_CATEGORIES[data.categoria],
    };
    validate(record);
    const name = field === "products" ? "nombre" : "titulo";
    if (records.some((item) => item.id !== existing?.id && item.active !== false && item[name].toLowerCase() === record[name].toLowerCase())) throw new Error("Ya existe un registro con ese nombre o título.");
    const updated = { ...record, id: existing?.id ?? Math.max(0, ...records.map((item) => item.id)) + 1, active: existing?.active !== false };
    const next = { ...state, [field]: existing ? records.map((item) => item.id === existing.id ? updated : item) : [...records, updated] };
    writeJson(storage, CONTENT_KEY, next);
    return next;
  };
  const toggle = (user, field, id, permission) => {
    authorize(user, permission);
    const state = load();
    if (!state[field].some((item) => item.id === id)) throw new Error("El registro no existe.");
    const next = { ...state, [field]: state[field].map((item) => item.id === id ? { ...item, active: item.active === false } : item) };
    writeJson(storage, CONTENT_KEY, next);
    return next;
  };
  return {
    load,
    saveProduct: (user, data) => save(user, "products", data, checkProduct, "products:write"),
    saveNews: (user, data) => save(user, "news", data, checkNews, "news:write"),
    toggleProduct: (user, id) => toggle(user, "products", id, "products:write"),
    toggleNews: (user, id) => toggle(user, "news", id, "news:write"),
  };
}
