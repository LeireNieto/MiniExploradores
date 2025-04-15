document.addEventListener("DOMContentLoaded", () => {
    const ciudadSelect = document.getElementById("ciudad");
    const actividadesContainer = document.getElementById("actividades");
    const climaContainer = document.getElementById("clima");
    const verClimaBtn = document.getElementById("verClimaBtn");
    const verMapaBtn = document.getElementById("verMapaBtn");
    const contenedorMapa = document.getElementById("contenedorMapa");
    const apiKey = '128c0695af7352f6da50d38443d5b508';

    let actividades = [];
    let mapa = L.map('mapa').setView([43.2630, -2.9350], 12);
    let marcadores = [];

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);

    // Ocultar clima al inicio
    climaContainer.style.display = "none";

    // Mostrar u ocultar el clima al hacer clic
    verClimaBtn.addEventListener("click", () => {
        const visible = climaContainer.style.display === "block";
        climaContainer.style.display = visible ? "none" : "block";

        verClimaBtn.innerHTML = visible
            ? '<i class="fas fa-cloud-sun"></i> Ver clima'
            : '<i class="fas fa-times-circle"></i> Ocultar clima';

        if (!visible && ciudadSelect.value) {
            obtenerClima(ciudadSelect.value);
        }
    });

    // Mostrar u ocultar el mapa
    verMapaBtn.addEventListener("click", () => {
        const visible = contenedorMapa.style.display === "block";
        contenedorMapa.style.display = visible ? "none" : "block";

        verMapaBtn.innerHTML = visible
            ? '<i class="fas fa-map-marker-alt"></i> Ver ubicaciones en el mapa'
            : '<i class="fas fa-times-circle"></i> Ocultar mapa';

        if (!visible) {
            setTimeout(() => {
                mapa.invalidateSize(); // arregla visualización
            }, 200);
        }
    });

    // Cargar actividades
    fetch("actividades.json")
        .then(res => res.json())
        .then(data => {
            actividades = data;

            ciudadSelect.addEventListener("change", () => {
                const ciudad = ciudadSelect.value;
                mostrarActividades(ciudad);

                if (climaContainer.style.display === "block") {
                    obtenerClima(ciudad);
                }
            });
        });

    // Mostrar actividades
    function mostrarActividades(ciudad) {
        actividadesContainer.innerHTML = "";
        marcadores.forEach(m => mapa.removeLayer(m));
        marcadores = [];

        const filtradas = actividades.filter(a => a.ciudad === ciudad);

        if (filtradas.length === 0) {
            actividadesContainer.innerHTML = "<p>No hay actividades disponibles para esta ciudad.</p>";
            return;
        }

        if (filtradas[0].lat && filtradas[0].lng) {
            mapa.setView([filtradas[0].lat, filtradas[0].lng], 13);
        }

        filtradas.forEach(a => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <img src="imagenes/${a.imagen}" alt="${a.nombre}">
                        <h3>${a.nombre}</h3>
                    </div>
                    <div class="card-back">
                        <p>${a.descripcion}</p>
                        <p><strong>Edad recomendada:</strong> ${a.edad}</p>
                        <p><strong>Precio:</strong> ${a.precio}</p>
                        <p><strong>Ubicación:</strong> ${a.ubicacion}</p>
                        <a href="${a.enlace}" target="_blank">Más información</a>
                    </div>
                </div>
            `;
            actividadesContainer.appendChild(card);

            if (a.lat && a.lng) {
                const marcador = L.marker([a.lat, a.lng])
                    .addTo(mapa)
                    .bindPopup(`<strong>${a.nombre}</strong><br>${a.ubicacion}`);
                marcadores.push(marcador);
            }
        });
    }

    // Obtener clima
    async function obtenerClima(ciudad) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${apiKey}&units=metric&lang=es`;
            const respuesta = await fetch(url);
            const datos = await respuesta.json();

            const opcionCiudad = ciudadSelect.querySelector(`option[value="${ciudad}"]`);
            document.getElementById('nombreCiudad').textContent = opcionCiudad.textContent;
            document.getElementById('descripcion').textContent = datos.weather[0].description;
            document.getElementById('temperatura').textContent = datos.main.temp + "°C";
            const icono = datos.weather[0].icon;
            document.getElementById('iconoClima').src = `http://openweathermap.org/img/wn/${icono}.png`;
            document.getElementById('iconoClima').alt = datos.weather[0].description;
        } catch (error) {
            console.error('❌ Error al obtener el clima:', error);
        }
    }
});
