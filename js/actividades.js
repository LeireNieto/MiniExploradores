import { obtenerFavoritos, esFavorito, toggleFavorito } from './favoritos.js';

let actividades = [];
let mapa;
let marcadores = [];

export function inicializarActividades() {
    const mapaElemento = document.getElementById("mapa");
    mapa = L.map(mapaElemento).setView([43.2630, -2.9350], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);

    const contenedorMapa = document.getElementById("contenedorMapa");
    const verMapaBtn = document.getElementById("verMapaBtn");
    const verFavoritosBtn = document.getElementById("verFavoritosBtn");
    let mostrandoFavoritos = false;

    verMapaBtn.addEventListener("click", () => {
        const visible = contenedorMapa.style.display === "block";
        contenedorMapa.style.display = visible ? "none" : "block";
        verMapaBtn.innerHTML = visible
            ? '<i class="fas fa-map-marker-alt"></i> Ver ubicaciones'
            : '<i class="fas fa-times-circle"></i> Ocultar mapa';
        if (!visible) setTimeout(() => mapa.invalidateSize(), 200);
    });

    verFavoritosBtn.addEventListener("click", () => {
        mostrandoFavoritos = !mostrandoFavoritos;
        if (mostrandoFavoritos) {
            verFavoritosBtn.innerHTML = '<i class="fas fa-heart"></i> Mostrar todo';
            mostrarFavoritos();
        } else {
            verFavoritosBtn.innerHTML = '<i class="fas fa-heart"></i> Ver favoritos';
            mostrarActividades(document.getElementById("ciudad").value);
        }
    });

    fetch("actividades.json")
        .then(res => res.json())
        .then(data => {
            actividades = data;
            mostrarActividades(document.getElementById("ciudad").value);
        });

    const scrollContainer = document.getElementById("actividades");
    document.getElementById("flechaIzquierda").addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -300, behavior: "smooth" });
    });
    document.getElementById("flechaDerecha").addEventListener("click", () => {
        scrollContainer.scrollBy({ left: 300, behavior: "smooth" });
    });
}

export function mostrarActividades(ciudad) {
    const contenedor = document.getElementById("actividades");
    contenedor.innerHTML = "";
    marcadores.forEach(m => mapa.removeLayer(m));
    marcadores = [];

    const filtradas = actividades.filter(a => a.ciudad === ciudad);
    if (filtradas.length === 0) {
        contenedor.innerHTML = "<p>No hay actividades disponibles para esta ciudad.</p>";
        return;
    }

    if (filtradas[0].lat && filtradas[0].lng) {
        mapa.setView([filtradas[0].lat, filtradas[0].lng], 13);
    }

    // Contenedor horizontal para las actividades
    const grupoActividades = document.createElement("div");
    grupoActividades.classList.add("actividades-horizontal");
    grupoActividades.style.display = "flex";
    grupoActividades.style.overflowX = "auto";
    grupoActividades.style.gap = "1rem";
    grupoActividades.style.padding = "1rem 0";
    grupoActividades.style.width = "100%";

    filtradas.forEach(a => crearCard(a, grupoActividades));
    contenedor.appendChild(grupoActividades);
}

function mostrarFavoritos() {
    const contenedor = document.getElementById("actividades");
    contenedor.innerHTML = "";
    marcadores.forEach(m => mapa.removeLayer(m));
    marcadores = [];

    const favoritos = obtenerFavoritos();
    const actividadesFavoritas = actividades.filter(a => favoritos.includes(a.id));

    if (actividadesFavoritas.length === 0) {
        contenedor.innerHTML = "<p>No tienes actividades favoritas.</p>";
        return;
    }

    // Agrupar por ciudad
    const favoritasPorCiudad = {};
    actividadesFavoritas.forEach(a => {
        if (!favoritasPorCiudad[a.ciudad]) favoritasPorCiudad[a.ciudad] = [];
        favoritasPorCiudad[a.ciudad].push(a);
    });

    // Mostrar por ciudad
    for (const ciudad in favoritasPorCiudad) {
        const tituloCiudad = document.createElement("h3");
        tituloCiudad.textContent = ciudad;
        contenedor.appendChild(tituloCiudad);

        const grupoCiudad = document.createElement("div");
        grupoCiudad.classList.add("actividades-horizontal");
        grupoCiudad.style.display = "flex";
        grupoCiudad.style.overflowX = "auto";
        grupoCiudad.style.gap = "1rem";
        grupoCiudad.style.padding = "1rem 0";
        grupoCiudad.style.width = "100%";

        favoritasPorCiudad[ciudad].forEach(a => crearCard(a, grupoCiudad, true));
        contenedor.appendChild(grupoCiudad);
    }

    const primera = actividadesFavoritas[0];
    if (primera.lat && primera.lng) mapa.setView([primera.lat, primera.lng], 13);
}

function crearCard(a, contenedor, esFavoritoView = false) {
    const card = document.createElement("div");
    card.classList.add("card", "actividad-card");
    card.style.minWidth = "250px"; // Ajusta según tu diseño

    const esFavoritoActividad = esFavorito(a.id);

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <img src="imagenes/${a.imagen}" alt="${a.nombre}">
                <h3>${a.nombre}</h3>
                <button class="flip-btn">+</button>
                <button class="fav-btn"><i class="${esFavoritoActividad ? 'fas' : 'far'} fa-heart"></i></button>
            </div>
            <div class="card-back">
                <p>${a.descripcion}</p>
                <p><strong>Edad recomendada:</strong> ${a.edad}</p>
                <p><strong>Precio:</strong> ${a.precio}</p>
                <p><strong>Ubicación:</strong> ${a.ubicacion}</p>
                ${a.enlace ? `<a href="${a.enlace}" target="_blank">Más información</a>` : ""}
                <button class="volver-btn">Volver</button>
            </div>
        </div>
    `;

    const flipBtn = card.querySelector(".flip-btn");
    flipBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.toggle("flip");
    });

    const volverBtn = card.querySelector(".volver-btn");
    volverBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.remove("flip");
    });

    const favBtn = card.querySelector(".fav-btn");
    const icono = favBtn.querySelector("i");

    favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorito(a.id);
        icono.classList.toggle("far");
        icono.classList.toggle("fas");
        if (esFavoritoView) mostrarFavoritos();
    });

    contenedor.appendChild(card);

    if (a.lat && a.lng) {
        const marcador = L.marker([a.lat, a.lng])
            .addTo(mapa)
            .bindPopup(`<strong>${a.nombre}</strong><br>${a.ubicacion}`);
        marcadores.push(marcador);
    }
}
