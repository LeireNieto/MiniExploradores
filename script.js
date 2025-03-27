document.addEventListener("DOMContentLoaded", () => {
    const ciudadSelect = document.getElementById("ciudad");
    const actividadesContainer = document.getElementById("actividades");
    let actividades = [];

    // Cargar datos desde el archivo JSON
    fetch("actividades.json")
        .then(response => response.json())
        .then(data => {
            actividades = data;
            ciudadSelect.addEventListener("change", mostrarActividades);
        })
        .catch(error => console.error("Error cargando el JSON:", error));

    function mostrarActividades() {
        const ciudadSeleccionada = ciudadSelect.value;
        actividadesContainer.innerHTML = "";

        const filtradas = actividades.filter(a => a.ciudad === ciudadSeleccionada);
        
        if (filtradas.length === 0) {
            actividadesContainer.innerHTML = "<p>No hay actividades disponibles para esta ciudad.</p>";
            return;
        }

        filtradas.forEach(a => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="imagenes/${a.imagen}" alt="${a.nombre}">
                <h3>${a.nombre}</h3>
                <p>${a.descripcion}</p>
                <p><strong>Edad recomendada:</strong> ${a.edad}</p>
                <p><strong>Precio:</strong> ${a.precio}</p>
                <p><strong>Ubicación:</strong> ${a.ubicacion}</p>
                <a href="${a.enlace}" target="_blank">Más información</a>
            `;
            actividadesContainer.appendChild(card);
        });
    }
});
