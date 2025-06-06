// actividades.js
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
        const card = document.createElement("div");
        card.classList.add("card", "actividad-card");


        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="imagenes/${a.imagen}" alt="${a.nombre}">
                    <h3>${a.nombre}</h3>
                    <button class="flip-btn">+</button>
                    <button class="fav-btn">♥</button>
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

        // 🔄 Activar giro al hacer clic en el botón +
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


        contenedor.appendChild(card);

        if (a.lat && a.lng) {
            const marcador = L.marker([a.lat, a.lng])
                .addTo(mapa)
                .bindPopup(`<strong>${a.nombre}</strong><br>${a.ubicacion}`);
            marcadores.push(marcador);
        }
    });
}
