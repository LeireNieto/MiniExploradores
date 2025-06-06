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

    // Botón nuevo "Ver favoritos"
    const verFavoritosBtn = document.getElementById("verFavoritosBtn");
    let mostrandoFavoritos = false;

    verMapaBtn.addEventListener("click", () => {
        const visible = contenedorMapa.style.display === "block";
        contenedorMapa.style.display = visible ? "none" : "block";

        verMapaBtn.innerHTML = visible
            ? '<i class="fas fa-map-marker-alt"></i> Ver ubicaciones'
            : '<i class="fas fa-times-circle"></i> Ocultar mapa';

        if (!visible) {
            setTimeout(() => mapa.invalidateSize(), 200);
        }
    });

    verFavoritosBtn.addEventListener("click", () => {
        mostrandoFavoritos = !mostrandoFavoritos;
        const ciudadSeleccionada = document.getElementById("ciudad").value;

        if (mostrandoFavoritos) {
            verFavoritosBtn.innerHTML = '<i class="fas fa-heart"></i> Mostrar todo';
            mostrarFavoritos();
        } else {
            verFavoritosBtn.innerHTML = '<i class="fas fa-heart"></i> Ver favoritos';
            mostrarActividades(ciudadSeleccionada);
        }
    });

    fetch("actividades.json")
        .then(res => res.json())
        .then(data => {
            actividades = data;
            mostrarActividades(document.getElementById("ciudad").value);
        });

    // Scroll horizontal
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

    filtradas.forEach(a => {
        crearCard(a, contenedor);
    });
}

function mostrarFavoritos() {
    const contenedor = document.getElementById("actividades");
    contenedor.innerHTML = "";
    marcadores.forEach(m => mapa.removeLayer(m));
    marcadores = [];

    const favoritos = obtenerFavoritos();

    const actividadesFavoritas = actividades.filter(a => favoritos.includes(a.id || a.nombre));

    if (actividadesFavoritas.length === 0) {
        contenedor.innerHTML = "<p>No tienes actividades favoritas.</p>";
        return;
    }

    if (actividadesFavoritas[0].lat && actividadesFavoritas[0].lng) {
        mapa.setView([actividadesFavoritas[0].lat, actividadesFavoritas[0].lng], 13);
    }

    actividadesFavoritas.forEach(a => {
        crearCard(a, contenedor, true);
    });
}

function crearCard(a, contenedor, esFavoritoView = false) {
    const card = document.createElement("div");
    card.classList.add("card", "actividad-card");

    // Para el corazón: si está favorito, rellena el corazón
    const favoritos = obtenerFavoritos();
    const esFavorito = favoritos.includes(a.id || a.nombre);

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <img src="imagenes/${a.imagen}" alt="${a.nombre}">
                <h3>${a.nombre}</h3>
                <button class="flip-btn">+</button>
                <button class="fav-btn"><i class="${esFavorito ? 'fas' : 'far'} fa-heart"></i></button>
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
    const idActividad = a.id || a.nombre;

    favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const favoritos = obtenerFavoritos();
        const index = favoritos.indexOf(idActividad);

        if (index === -1) {
            favoritos.push(idActividad);
            icono.classList.remove("far");
            icono.classList.add("fas");
            favBtn.classList.add("activo");
        } else {
            favoritos.splice(index, 1);
            icono.classList.remove("fas");
            icono.classList.add("far");
            favBtn.classList.remove("activo");
        }

        guardarFavoritos(favoritos);

        // Si estamos en la vista de favoritos, al quitar uno se actualiza la lista
        if (esFavoritoView) {
            mostrarFavoritos();
        }
    });

    contenedor.appendChild(card);

    if (a.lat && a.lng) {
        const marcador = L.marker([a.lat, a.lng])
            .addTo(mapa)
            .bindPopup(`<strong>${a.nombre}</strong><br>${a.ubicacion}`);
        marcadores.push(marcador);
    }
}

function obtenerFavoritos() {
    const favs = localStorage.getItem("favoritos");
    return favs ? JSON.parse(favs) : [];
}

function guardarFavoritos(favoritos) {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}
