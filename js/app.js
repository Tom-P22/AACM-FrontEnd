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

// --- RENDERIZADO Y LÓGICA DE PRODUCTOS ---

function getProducts() {
    const stored = localStorage.getItem('productos_deportes');
    if (stored === null) {
        localStorage.setItem('productos_deportes', JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);
}

function formatCLP(amount) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
}

function renderProductsCatalog() {
    const container = document.getElementById('catalog-products-list');
    if (container === null) return;

    let filterCategory = document.getElementById('filter-category');
    let filterVal = "ALL";
    if (filterCategory !== null) {
        filterVal = filterCategory.value;
    }

    const products = getProducts();
    let htmlAcumulado = "";

    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        
        if (filterVal === "ALL" || p.categoria === filterVal) {
            htmlAcumulado += `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 shadow-sm border-0">
                        <img src="../${p.imagen}" class="card-img-top" alt="${p.nombre}" style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="badge bg-primary-subtle text-primary fw-bold px-2 py-1">${p.categoria}</span>
                                <span class="fw-bold text-success fs-5">${formatCLP(p.precio)}</span>
                            </div>
                            <h5 class="card-title fw-bold">${p.nombre}</h5>
                            <p class="card-text text-muted small flex-grow-1">${p.descripcion}</p>
                            <button onclick="addToCart(${p.id})" class="btn btn-primary w-100 mt-3 fw-bold">
                                <i class="fa-solid fa-cart-plus me-1"></i> Reservar / Añadir
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    if (htmlAcumulado === "") {
        container.innerHTML = `<div class="col-12 text-center text-muted py-5"><p class="fs-5">No hay ítems disponibles en esta categoría.</p></div>`;
    } else {
        container.innerHTML = htmlAcumulado;
    }
}

// Productos destacados
function renderHomeFeatured() {
    const container = document.getElementById('home-featured-products');
    if (container === null) return;

    const products = getProducts();
    let htmlAcumulado = "";

    let maximo = 3;
    if (products.length < 3) {
        maximo = products.length;
    }

    for (let i = 0; i < maximo; i++) {
        let p = products[i];
        htmlAcumulado += `
            <div class="col-md-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <span class="badge bg-info-subtle text-info-emphasis align-self-start mb-2 fw-semibold">${p.categoria}</span>
                        <h5 class="card-title fw-bold">${p.nombre}</h5>
                        <p class="card-text text-muted small flex-grow-1">${p.descripcion}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                            <span class="fw-bold text-primary fs-5">${formatCLP(p.precio)}</span>
                            <button onclick="addToCart(${p.id})" class="btn btn-outline-primary btn-sm fw-bold">
                                <i class="fa-solid fa-calendar-check me-1"></i> Reservar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = htmlAcumulado;
}

// Añadir al carrito (funcion futura)
function addToCart(productId) {
    alert("Reserva añadida con éxito");
}


// --- FUNCIONES DE VALIDACIÓN ---

// Validación de RUT
function validarRUT(rut) {
    rut = rut.replace(/[^0-9kK]/g, '');
    if (rut.length < 7 || rut.length > 9) return false;

    const dv = rut.slice(-1).toUpperCase();
    const rutNum = parseInt(rut.slice(0, -1), 10);
    if (isNaN(rutNum)) return false;

    let suma = 0, multiplicador = 2, temp = rutNum;
    while (temp > 0) {
        suma += (temp % 10) * multiplicador;
        temp = Math.floor(temp / 10);
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    let dvCalc = "";
    
    if (dvEsperado === 11) {
        dvCalc = "0";
    } else if (dvEsperado === 10) {
        dvCalc = "K";
    } else {
        dvCalc = dvEsperado.toString();
    }
    
    return dv === dvCalc;
}

// Validación de correo por dominio
function validarCorreoDominio(correo) {
    const dominios = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    let correoMin = correo.toLowerCase();
    
    for (let i = 0; i < dominios.length; i++) {
        if (correoMin.endsWith(dominios[i])) {
            return true;
        }
    }
    return false;
}

function setError(elementId, errorMsgId, message) {
    const el = document.getElementById(elementId);
    const err = document.getElementById(errorMsgId);
    if (el !== null) el.classList.add('is-invalid');
    if (err !== null) err.textContent = message;
    return false;
}

function clearError(elementId, errorMsgId) {
    const el = document.getElementById(elementId);
    const err = document.getElementById(errorMsgId);
    if (el !== null) el.classList.remove('is-invalid');
    if (err !== null) err.textContent = '';
    return true;
}
