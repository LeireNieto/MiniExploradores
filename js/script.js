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

    // Mostrar botón al hacer scroll
window.addEventListener('scroll', () => {
    const btn = document.getElementById('btnArriba');
    if (window.scrollY > 300) {
      btn.style.display = 'block';
    } else {
      btn.style.display = 'none';
    }
  });
  
  document.getElementById('btnArriba').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
});
