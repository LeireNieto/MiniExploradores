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
    const contenedorActividades = document.querySelector(".contenedor-actividades");
    const verMapaBtn = document.getElementById("verMapaBtn");
    const verFavoritosBtn = document.getElementById("verFavoritosBtn");
    let mostrandoFavoritos = false;

    function resetBotones() {
        verMapaBtn.innerHTML = `
            <i class="fas fa-map-marker-alt"></i>
            <span class="texto-boton">Ver ubicaciones</span>
        `;
        verFavoritosBtn.innerHTML = `
            <i class="fas fa-heart"></i>
            <span class="texto-boton">Ver favoritos</span>
        `;
        mostrandoFavoritos = false;
    }

    function mostrarMapa() {
        contenedorMapa.style.display = "block";
        contenedorActividades.style.display = "none";
        cerrarClimaYMapa();  // si tienes clima, lo cierras
        setTimeout(() => mapa.invalidateSize(), 200);

        verMapaBtn.innerHTML = `
            <i class="fas fa-times"></i>
            <span class="texto-boton">Ocultar mapa</span>
        `;
        verFavoritosBtn.innerHTML = `
            <i class="fas fa-heart"></i>
            <span class="texto-boton">Ver favoritos</span>
        `;
        mostrandoFavoritos = false;
    }

    function ocultarMapa() {
        contenedorMapa.style.display = "none";
        contenedorActividades.style.display = "block";

        verMapaBtn.innerHTML = `
            <i class="fas fa-map-marker-alt"></i>
            <span class="texto-boton">Ver ubicaciones</span>
        `;
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

        const favoritasPorCiudad = {};
        actividadesFavoritas.forEach(a => {
            if (!favoritasPorCiudad[a.ciudad]) favoritasPorCiudad[a.ciudad] = [];
            favoritasPorCiudad[a.ciudad].push(a);
        });

        for (const ciudad in favoritasPorCiudad) {
            const tituloCiudad = document.createElement("h3");
            tituloCiudad.textContent = ciudad;
            tituloCiudad.classList.add("favoritos-ciudad-titulo");
            contenedor.appendChild(tituloCiudad);

            const grupoCiudad = document.createElement("div");
            grupoCiudad.classList.add("actividades-grid");

            favoritasPorCiudad[ciudad].slice(0, 8).forEach(a => crearCard(a, grupoCiudad, true));
            contenedor.appendChild(grupoCiudad);
        }

        const primera = actividadesFavoritas[0];
        if (primera.lat && primera.lng) mapa.setView([primera.lat, primera.lng], 13);
    }

    verMapaBtn.addEventListener("click", () => {
        const visible = contenedorMapa.style.display === "block";
    
        if (visible) {
            contenedorMapa.style.display = "none";
            contenedorActividades.style.display = "block";
        
            // Cambia el botón de mapa a estado cerrado (mostrar icono marcador)
            verMapaBtn.innerHTML = `
                <i class="fas fa-map-marker-alt"></i>
                <span class="texto-boton">Ver ubicaciones</span>
            `;
        
            // Resetea estado favoritos y su botón
            mostrandoFavoritos = false;
            verFavoritosBtn.innerHTML = `
                <i class="fas fa-heart"></i>
                <span class="texto-boton">Ver favoritos</span>
            `;
        
            // Forzar a mostrar la lista normal de actividades (no favoritos)
            mostrarActividades(document.getElementById("ciudad").value);
        } else {
            // Cerramos clima y favoritos antes de mostrar mapa
            cerrarClimaYMapa();
    
            contenedorMapa.style.display = "block";
            contenedorActividades.style.display = "none";
            setTimeout(() => mapa.invalidateSize(), 200);
    
            // Cambia el botón de mapa a estado abierto (mostrar X)
            verMapaBtn.innerHTML = `
                <i class="fas fa-times"></i>
                <span class="texto-boton">Ocultar mapa</span>
            `;
        }
    
        // Al abrir o cerrar el mapa, resetea el botón favoritos a su estado cerrado (corazón)
        verFavoritosBtn.innerHTML = `
            <i class="fas fa-heart"></i>
            <span class="texto-boton">Ver favoritos</span>
        `;
        mostrandoFavoritos = false;
    });
    

    verFavoritosBtn.addEventListener("click", () => {
        mostrandoFavoritos = !mostrandoFavoritos;
    
        if (mostrandoFavoritos) {
            // Cierra clima y mapa y actualiza botones
            cerrarClimaYMapa();
    
            // Muestra favoritos y botón con X
            verFavoritosBtn.innerHTML = `
                <i class="fas fa-times"></i>
                <span class="texto-boton">Cerrar favoritos</span>
            `;
    
            contenedorActividades.style.display = "block";
            contenedorMapa.style.display = "none";
    
            mostrarFavoritos();
    
            // Asegurar que botón clima está cerrado (si necesitas)
            const verClimaBtn = document.getElementById("verClimaBtn");
            if (verClimaBtn) {
                verClimaBtn.setAttribute("aria-expanded", "false");
                verClimaBtn.innerHTML = '<i class="fas fa-cloud-sun"></i><span class="texto-boton">Ver clima</span>';
            }
        } else {
            // Muestra todas las actividades y botón con corazón
            verFavoritosBtn.innerHTML = `
                <i class="fas fa-heart"></i>
                <span class="texto-boton">Ver favoritos</span>
            `;
    
            mostrarActividades(document.getElementById("ciudad").value);
            contenedorActividades.style.display = "block";
            contenedorMapa.style.display = "none";
        }
    });
    
    

    document.getElementById("ciudad").addEventListener("change", (e) => {
        mostrarActividades(e.target.value);
        contenedorActividades.style.display = "block";
        contenedorMapa.style.display = "none";
    
        // Si quieres asegurarte de que el mapa se refresque bien al mostrarlo después
        setTimeout(() => {
            mapa.invalidateSize();
        }, 200);
    
        resetBotones();
    });

    fetch("actividades.json")
        .then(res => res.json())
        .then(data => {
            actividades = data;
            mostrarActividades(document.getElementById("ciudad").value);
        });
}

function cerrarClimaYMapa() {
    const clima = document.getElementById("clima");
    const clima5dias = document.getElementById("clima5dias");
    if (clima) clima.style.display = "none";
    if (clima5dias) clima5dias.style.display = "none";

    const verClimaBtn = document.getElementById("verClimaBtn");
    if (verClimaBtn) {
        verClimaBtn.setAttribute("aria-expanded", "false");
        verClimaBtn.innerHTML = '<i class="fas fa-cloud-sun"></i><span class="texto-boton">Ver clima</span>';
    }

    const contenedorMapa = document.getElementById("contenedorMapa");
    if (contenedorMapa) contenedorMapa.style.display = "none";

    const verMapaBtn = document.getElementById("verMapaBtn");
    if (verMapaBtn) {
        verMapaBtn.setAttribute("aria-expanded", "false");
        verMapaBtn.innerHTML = `
            <i class="fas fa-map-marker-alt"></i>
            <span class="texto-boton">Ver ubicaciones</span>
        `;
    }

    const contenedorActividades = document.querySelector(".contenedor-actividades");
    if (contenedorActividades) contenedorActividades.style.display = "block";
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

    const grupoActividades = document.createElement("div");
    grupoActividades.classList.add("actividades-grid");

    filtradas.slice(0, 8).forEach(a => crearCard(a, grupoActividades));
    contenedor.appendChild(grupoActividades);
}

function crearCard(a, contenedor, esFavoritoView = false) {
    const card = document.createElement("div");
    card.classList.add("card", "actividad-card");

    const esFavoritoActividad = esFavorito(a.id);

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <img src="imagenes/${a.imagen}" alt="${a.nombre}">
                <h3>${a.nombre}</h3>
                <button class="flip-btn" aria-label="Ver más detalles">+</button>
                <button class="fav-btn" aria-label="${esFavoritoActividad ? 'Quitar de favoritos' : 'Añadir a favoritos'}">
                    <i class="${esFavoritoActividad ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="card-back">
                <p>${a.descripcion}</p>
                <p><strong>Edad recomendada:</strong> ${a.edad}</p>
                <p><strong>Precio:</strong> ${a.precio}</p>
                <p><strong>Ubicación:</strong> ${a.ubicacion}</p>
                ${a.enlace ? `<a href="${a.enlace}" target="_blank" rel="noopener noreferrer">Más información</a>` : ""}
                <button class="volver-btn" aria-label="Volver a la tarjeta principal">Volver</button>
            </div>
        </div>
    `;

    const flipBtn = card.querySelector(".flip-btn");
    flipBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.toggle("flip");
        flipBtn.textContent = card.classList.contains("flip") ? "✖" : "+";
    });

    const volverBtn = card.querySelector(".volver-btn");
    volverBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.remove("flip");
        flipBtn.textContent = "+";
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
