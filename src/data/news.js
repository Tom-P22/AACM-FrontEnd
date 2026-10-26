export const INITIAL_NEWS = [
  { id: 1, titulo: "Inscripciones abiertas: Torneo Comunal de Tenis 2026", categoria: "Comunidad", badge: "bg-primary", imagen: "/img/ConcursoTenis.jpg", fecha: "2026-09-05", texto: "Únete al torneo anual que reúne a los mejores exponentes locales. Categorías todo competidor y senior." },
  { id: 2, titulo: "Nuevas luminarias LED en multicanchas", categoria: "Infraestructura", badge: "bg-success", imagen: "/img/LuminariaLedCancha.jpg", fecha: "2026-09-01", texto: "Hemos actualizado el sistema de iluminación en 3 de nuestras multicanchas para mejorar la experiencia nocturna." },
  { id: 3, titulo: "Nuevos talleres de fútbol formativo", categoria: "Talleres", badge: "bg-info", imagen: "/img/TallerFutbol.jpg", fecha: "2026-08-28", texto: "La corporación abre cupos limitados para talleres formativos orientados a niños y niñas entre 8 y 12 años." },
];

export const IMAGE_OPTIONS = [
  ["/img/CanchaSintetica.jpg", "Cancha de fútbol"], ["/img/CanchaTenisArcilla.jpg", "Cancha de tenis"],
  ["/img/Basketball.jpg", "Multicancha"], ["/img/BalonFutbolN5.jpg", "Balón de fútbol"],
  ["/img/RaquetasPelotasTenis.jpg", "Raquetas de tenis"], ["/img/PetosDeportivos.jpg", "Petos"],
  ["/img/ConcursoTenis.jpg", "Torneo de tenis"], ["/img/LuminariaLedCancha.jpg", "Luminarias"], ["/img/TallerFutbol.jpg", "Taller de fútbol"],
];

export const NEWS_CATEGORIES = { Comunidad: "bg-primary", Infraestructura: "bg-success", Talleres: "bg-info", Deportes: "bg-warning text-dark" };
