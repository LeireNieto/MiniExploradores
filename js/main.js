import { inicializarActividades, mostrarActividades } from './actividades.js';
import { obtenerClima, toggleClima } from './clima.js';

document.addEventListener("DOMContentLoaded", () => {
    const ciudadSelect = document.getElementById("ciudad");
    const climaContainer = document.getElementById("clima");
    const verClimaBtn = document.getElementById("verClimaBtn");

    inicializarActividades();

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

    window.addEventListener('scroll', () => {
        const btn = document.getElementById('btnArriba');
        btn.style.display = (window.scrollY > 300) ? 'block' : 'none';
    });
  
    document.getElementById('btnArriba').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
