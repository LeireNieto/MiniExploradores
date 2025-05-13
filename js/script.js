import { inicializarActividades, mostrarActividades } from './actividades.js';
import { obtenerClima, toggleClima } from './clima.js';

document.addEventListener("DOMContentLoaded", () => {
    const ciudadSelect = document.getElementById("ciudad");
    const climaContainer = document.getElementById("clima");
    const verClimaBtn = document.getElementById("verClimaBtn");

    // Inicializar actividades y mapa
    inicializarActividades();

    // Botón Ver Clima
    verClimaBtn.addEventListener("click", () => {
        toggleClima(ciudadSelect.value);
    });

    ciudadSelect.addEventListener("change", () => {
        const ciudad = ciudadSelect.value;
        mostrarActividades(ciudad);
        if (climaContainer.style.display === "block" && ciudad) {
            obtenerClima(ciudad);
        }
    });
});
