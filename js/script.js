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

    climaContainer.style.display = "none";

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

    verMapaBtn.addEventListener("click", () => {
        const visible = contenedorMapa.style.display === "block";
        contenedorMapa.style.display = visible ? "none" : "block";

        verMapaBtn.innerHTML = visible
            ? '<i class="fas fa-map-marker-alt"></i> Ver ubicaciones'
            : '<i class="fas fa-times-circle"></i> Ocultar mapa';

        if (!visible) {
            setTimeout(() => {
                mapa.invalidateSize();
            }, 200);
        }
    });

    fetch("actividades.json")
        .then(res => res.json())
        .then(data => {
            actividades = data;

            ciudadSelect.addEventListener("change", () => {
                const ciudad = ciudadSelect.value;
                mostrarActividades(ciudad);

                if (climaContainer.style.display === "block" && ciudad) {
                    obtenerClima(ciudad);
                }
            });
        });

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
                        ${a.enlace ? `<a href="${a.enlace}" target="_blank">Más información</a>` : ""}
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

    async function obtenerClima(ciudad) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(ciudad)}&appid=${apiKey}&units=metric&lang=es`;
            const respuesta = await fetch(url);
            const datos = await respuesta.json();

            const nombreCiudad = ciudadSelect.querySelector(`option[value="${ciudad}"]`).textContent;
            
            // Limpiar contenido anterior
            climaContainer.innerHTML = `<h2>Pronóstico de tiempo en ${nombreCiudad} (5 días)</h2>`;

            const diasMostrados = [];
            for (let i = 0; i < datos.list.length; i++) {
                const entrada = datos.list[i];
                const fecha = new Date(entrada.dt_txt);
                const dia = fecha.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'short' });

                if (!diasMostrados.includes(dia)) {
                    diasMostrados.push(dia);

                    const descripcion = entrada.weather[0].description;
                    const temp = entrada.main.temp;
                    const icono = entrada.weather[0].icon;
                    const iconoURL = `https://openweathermap.org/img/wn/${icono}.png`;

                    const itemHTML = `
                        <div class="dia-clima">
                            <h3>${dia}</h3>
                            <img src="${iconoURL}" alt="${descripcion}">
                            <p><strong>${descripcion}</strong></p>
                            <p>Temperatura: ${temp.toFixed(1)}°C</p>
                        </div>
                    `;
                    climaContainer.innerHTML += itemHTML;

                    if (diasMostrados.length >= 5) break;
                }
            }
        } catch (error) {
            console.error("❌ Error al obtener el clima:", error);
            climaContainer.innerHTML += `<p>No se pudo cargar el clima. Intenta más tarde.</p>`;
        }
    }

    // Scroll horizontal
    const scrollContainer = document.getElementById("actividades");
    const flechaIzquierda = document.getElementById("flechaIzquierda");
    const flechaDerecha = document.getElementById("flechaDerecha");

    flechaIzquierda.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -300, behavior: "smooth" });
    });

    flechaDerecha.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: 300, behavior: "smooth" });
    });
});
