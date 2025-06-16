const apiKey = '128c0695af7352f6da50d38443d5b508';
const climaContainer = document.getElementById("clima");
const verClimaBtn = document.getElementById("verClimaBtn");

export function toggleClima(ciudad) {
    const visible = climaContainer.style.display === "block";
    climaContainer.style.display = visible ? "none" : "block";
    verClimaBtn.innerHTML = visible
        ? '<i class="fas fa-cloud-sun"></i><span>Ver clima</span>'
        : '<i class="fas fa-times-circle"></i><span>Ocultar clima</span>';

    if (!visible) {
        // Ocultar actividades
        const contenedorActividades = document.querySelector(".contenedor-actividades");
        if (contenedorActividades) contenedorActividades.style.display = "none";

        // Ocultar mapa
        const contenedorMapa = document.getElementById("contenedorMapa");
        if (contenedorMapa) contenedorMapa.style.display = "none";

        // Cambiar texto del botón de mapa
        const verMapaBtn = document.getElementById("verMapaBtn");
        if (verMapaBtn) {
            verMapaBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i><span>Ver ubicaciones</span>';
        }

        // Mostrar clima
        if (ciudad) obtenerClima(ciudad);
    } else {
        // Al cerrar clima, mostrar actividades
        const contenedorActividades = document.querySelector(".contenedor-actividades");
        if (contenedorActividades) contenedorActividades.style.display = "block";
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
