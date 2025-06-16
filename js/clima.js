const apiKey = '128c0695af7352f6da50d38443d5b508';
const climaContainer = document.getElementById("clima");
const verClimaBtn = document.getElementById("verClimaBtn");

export function toggleClima(ciudad) {
    const visible = climaContainer.style.display === "block";

    if (visible) {
        // Ocultar clima
        climaContainer.style.display = "none";
        verClimaBtn.innerHTML = '<i class="fas fa-cloud-sun"></i><span>Ver clima</span>';

        // Mostrar actividades normales
        const contenedorActividades = document.querySelector(".contenedor-actividades");
        if (contenedorActividades) contenedorActividades.style.display = "block";

    } else {
        // Mostrar clima
        climaContainer.style.display = "block";

        // Ocultar actividades
        const contenedorActividades = document.querySelector(".contenedor-actividades");
        if (contenedorActividades) contenedorActividades.style.display = "none";

        // Ocultar mapa si está abierto
        const contenedorMapa = document.getElementById("contenedorMapa");
        if (contenedorMapa) contenedorMapa.style.display = "none";

        // Ocultar favoritos si está abierto
        const contenedorFavoritos = document.getElementById("contenedorFavoritos");
        if (contenedorFavoritos) contenedorFavoritos.style.display = "none";

        // Cambiar botón clima a X
        verClimaBtn.innerHTML = '<i class="fas fa-times"></i><span>Ocultar clima</span>';

        // Resetear botón mapa
        const verMapaBtn = document.getElementById("verMapaBtn");
        if (verMapaBtn) {
            verMapaBtn.innerHTML = `
                <i class="fas fa-map-marker-alt"></i>
                <span class="texto-boton">Ver ubicaciones</span>
            `;
        }

        // Resetear botón favoritos (corazón y texto)
        const verFavoritosBtn = document.getElementById("verFavoritosBtn");
        if (verFavoritosBtn) {
            verFavoritosBtn.innerHTML = `
                <i class="fas fa-heart"></i>
                <span class="texto-boton">Ver favoritos</span>
            `;
            mostrandoFavoritos = false; // si usas esa variable para el estado
        }

        if (ciudad) obtenerClima(ciudad);
    }
}



export async function obtenerClima(ciudad) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(ciudad)}&appid=${apiKey}&units=metric&lang=es`;
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        const nombreCiudad = document.querySelector(`#ciudad option[value="${ciudad}"]`).textContent;
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

                climaContainer.innerHTML += `
                    <div class="dia-clima">
                        <h3>${dia}</h3>
                        <img src="${iconoURL}" alt="${descripcion}">
                        <p><strong>${descripcion}</strong></p>
                        <p>Temperatura: ${temp.toFixed(1)}°C</p>
                    </div>
                `;

                if (diasMostrados.length >= 5) break;
            }
        }
    } catch (error) {
        console.error("❌ Error al obtener el clima:", error);
        climaContainer.innerHTML += `<p>No se pudo cargar el clima. Intenta más tarde.</p>`;
    }
}
