document.addEventListener("DOMContentLoaded", () => {
    const actividades = [
        {
            ciudad: "Madrid",
            nombre: "Parque Warner",
            imagen: "warner.jpg",
            descripcion: "Parque temático con atracciones para todas las edades.",
            edad: "Todas las edades",
            precio: "Desde 30€",
            ubicacion: "San Martín de la Vega",
            enlace: "https://www.parquewarner.com/"
        },
        {
            ciudad: "Barcelona",
            nombre: "Zoo de Barcelona",
            imagen: "zoo.jpg",
            descripcion: "Descubre animales de todo el mundo en un entorno natural.",
            edad: "Todas las edades",
            precio: "Desde 21€",
            ubicacion: "Parc de la Ciutadella",
            enlace: "https://www.zoobarcelona.cat/"
        }
    ];

    const ciudadSelect = document.getElementById("ciudad");
    const actividadesContainer = document.getElementById("actividades");

    function mostrarActividades() {
        const ciudadSeleccionada = ciudadSelect.value;
        actividadesContainer.innerHTML = "";

        const filtradas = actividades.filter(a => a.ciudad === ciudadSeleccionada);
        filtradas.forEach(a => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${a.imagen}" alt="${a.nombre}">
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

    ciudadSelect.addEventListener("change", mostrarActividades);
});
