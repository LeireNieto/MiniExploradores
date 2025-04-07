document.addEventListener("DOMContentLoaded", () => {
    const ciudadSelect = document.getElementById("ciudad");
    const actividadesContainer = document.getElementById("actividades");
    const apiKey = '128c0695af7352f6da50d38443d5b508'; // tu clave de OpenWeather

    let actividades = [];
    let mapa = L.map('mapa').setView([43.2630, -2.9350], 12);
    let marcadores = [];

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);

    // 1. Cargar actividades
    fetch("actividades.json")
        .then(res => res.json())
        .then(data => {
            actividades = data;
            ciudadSelect.addEventListener("change", () => {
                const ciudad = ciudadSelect.value;
                mostrarActividades(ciudad);
                obtenerClima(ciudad);
            });
        });

    // 2. Mostrar actividades + marcadores
    function mostrarActividades(ciudad) {
        actividadesContainer.innerHTML = "";
        marcadores.forEach(m => mapa.removeLayer(m));
        marcadores = [];

        const filtradas = actividades.filter(a => a.ciudad === ciudad);

        if (filtradas.length === 0) {
            actividadesContainer.innerHTML = "<p>No hay actividades disponibles para esta ciudad.</p>";
            return;
        }

        // Centrar mapa en la primera actividad si tiene coordenadas
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

            // Marcador en el mapa
            if (a.lat && a.lng) {
                const marcador = L.marker([a.lat, a.lng])
                    .addTo(mapa)
                    .bindPopup(`<strong>${a.nombre}</strong><br>${a.ubicacion}`);
                marcadores.push(marcador);
            }
        });
    }

    // 3. Clima
    async function obtenerClima(ciudad) {
        try {
            //const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(ciudad)}&appid={apiKey}&units=metric&lang=es`;
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${apiKey}&units=metric&lang=es`;
            const respuesta = await fetch(url);
            const datos = await respuesta.json();

            console.log(datos)

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
