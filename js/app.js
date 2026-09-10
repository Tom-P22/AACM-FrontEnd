// --- BASE DE DATOS DE PRODUCTOS Y CANCHAS ---
const INITIAL_PRODUCTS = [
    {
        id: 1,
        nombre: "Cancha de Fútbol 7 - Pasto Sintético",
        categoria: "Canchas",
        precio: 35000,
        descripcion: "Cancha con iluminación LED de alta potencia, drenaje de agua e instalaciones con vestidores y duchas.",
        imagen: "img/CanchaSintetica.jpg"
    },
    {
        id: 2,
        nombre: "Cancha de Tenis - Arcilla",
        categoria: "Canchas",
        precio: 18000,
        descripcion: "Superficie de arcilla profesional mantenida diariamente. Incluye red oficial y demarcación reglamentaria.",
        imagen: "img/CanchaTenisArcilla.jpg"
    },
    {
        id: 3,
        nombre: "Multicancha de Básquetbol y Volleyball",
        categoria: "Canchas",
        precio: 22000,
        descripcion: "Piso tratada para alto impacto. Tableros de vidrio templado y red de voleibol regulable.",
        imagen: "img/Basketball.jpg"
    },
    {
        id: 4,
        nombre: "Balón Oficial de Fútbol N° 5",
        categoria: "Implementos",
        precio: 15000,
        descripcion: "Balón de cuero sintético multicapa con alta retención de aire y costuras reforzadas.",
        imagen: "img/BalonFutbolN5.jpg"
    },
    {
        id: 5,
        nombre: "Set de Raquetas y Pelotas de Tenis",
        categoria: "Implementos",
        precio: 12000,
        descripcion: "Incluye 2 raquetas de aluminio ligero y tubo con 3 pelotas presurizadas de gran durabilidad.",
        imagen: "img/RaquetasPelotasTenis.jpg"
    },
    {
        id: 6,
        nombre: "Set de Petos Deportivos (10 unid.)",
        categoria: "Indumentaria",
        precio: 18000,
        descripcion: "Malla transpirable de alta visibilidad para diferenciación de equipos en entrenamientos.",
        imagen: "img/PetosDeportivos.jpg"
    }
];

// Configuración de regiones y comunas
const REGIONES_COMUNAS = {
    "Región Metropolitana de Santiago": ["San Miguel", "San Joaquín", "La Cisterna", "Santiago", "Providencia"],
    "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
    "Región del Biobío": ["Concepción", "Talcahuano", "Los Ángeles"]
};

