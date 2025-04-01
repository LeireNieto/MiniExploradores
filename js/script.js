document.addEventListener("DOMContentLoaded", () => {
    const ciudadSelect = document.getElementById("ciudad");
    const actividadesContainer = document.getElementById("actividades");
    let actividades = [];

    const apiKey = '128c0695af7352f6da50d38443d5b508'; // Reemplázala con tu clave real

    // Cargar datos desde el archivo JSON
    fetch("actividades.json")
        .then(response => response.json())
        .then(data => {
            actividades = data;
            ciudadSelect.addEventListener("change", manejarCambioCiudad);
            // Cargar clima y actividades de la ciudad seleccionada por defecto al inicio
            if (ciudadSelect.value) {
                manejarCambioCiudad();
            }
        })
        .catch(error => console.error("Error cargando el JSON:", error));

    // Función para manejar el cambio de ciudad
    function manejarCambioCiudad() {
        const ciudadSeleccionada = ciudadSelect.value;
        if (ciudadSeleccionada) {
            obtenerClima(ciudadSeleccionada);
            mostrarActividades(ciudadSeleccionada);
        }
    }

    // Función para mostrar las actividades de la ciudad seleccionada
    function mostrarActividades(ciudad) {
        actividadesContainer.innerHTML = "";

        const filtradas = actividades.filter(a => a.ciudad === ciudad);
        
        if (filtradas.length === 0) {
            actividadesContainer.innerHTML = "<p>No hay actividades disponibles para esta ciudad.</p>";
            return;
        }

        filtradas.forEach(a => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <div class="card-inner">
                    <!-- Parte frontal -->
                    <div class="card-front">
                        <img src="imagenes/${a.imagen}" alt="${a.nombre}">
                        <h3>${a.nombre}</h3>
                    </div>
                    <!-- Parte trasera -->
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
        });
    }

    // Función para obtener el clima de la ciudad seleccionada
    async function obtenerClima(ciudad) {
        try {
            console.log(`Obteniendo clima para: ${ciudad}...`);

            const ciudadCodificada = encodeURIComponent(ciudad);
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudadCodificada}&appid=${apiKey}&units=metric&lang=es`;

            const respuesta = await fetch(url);
            
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }

            const datos = await respuesta.json();

            // Actualizar el clima en el HTML
            document.getElementById('nombreCiudad').textContent = ciudad;
            document.getElementById('descripcion').textContent = datos.weather[0].description;
            document.getElementById('temperatura').textContent = datos.main.temp + "°C";

            // Mostrar el icono del clima
            const icono = datos.weather[0].icon;
            const urlIcono = `http://openweathermap.org/img/wn/${icono}.png`;
            document.getElementById('iconoClima').src = urlIcono;
            document.getElementById('iconoClima').alt = datos.weather[0].description;

            // Aquí utilizamos el icono de FontAwesome para representar el clima
        const iconoClima = datos.weather[0].main.toLowerCase();  // Obtener el nombre del clima (ej: 'clear', 'rain')
        document.getElementById('iconoClima').className = `fas fa-cloud-${iconoClima}`;  // Usar FontAwesome para los iconos
            console.log("✅ Clima actualizado correctamente.");
        } catch (error) {
            console.error('❌ Error al obtener el clima:', error);
        }
    }
});
