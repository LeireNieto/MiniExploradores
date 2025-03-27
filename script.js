document.addEventListener("DOMContentLoaded", () => {
    const ciudadSelect = document.getElementById("ciudad");
    const actividadesContainer = document.getElementById("actividades");
    const commentInput = document.getElementById("commentInput");
    const commentList = document.getElementById("commentList");
    const comentariosSection = document.getElementById("comentarios"); // Referencia a la sección de comentarios
    let actividades = [];
    let comentarios = []; // Array para almacenar los comentarios generales por ciudad

    // Cargar datos desde el archivo JSON
    fetch("actividades.json")
        .then(response => response.json())
        .then(data => {
            actividades = data;
            ciudadSelect.addEventListener("change", mostrarActividades);
        })
        .catch(error => console.error("Error cargando el JSON:", error));

    // Mostrar actividades y comentarios al cambiar de ciudad
    function mostrarActividades() {
        const ciudadSeleccionada = ciudadSelect.value;
        actividadesContainer.innerHTML = "";

        // Mostrar la sección de comentarios solo después de seleccionar una ciudad
        if (ciudadSeleccionada) {
            comentariosSection.style.display = "block"; // Mostrar la sección de comentarios
        }

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

        // Mostrar los comentarios de esta ciudad después de las actividades
        mostrarComentarios(ciudadSeleccionada);
    }

    // Mostrar los comentarios generales para la ciudad seleccionada
    function mostrarComentarios(ciudadSeleccionada) {
        const comentariosFiltrados = comentarios.filter(c => c.ciudad === ciudadSeleccionada);
        commentList.innerHTML = ""; // Limpiar comentarios previos

        if (comentariosFiltrados.length === 0) {
            commentList.innerHTML = "<p>No hay comentarios para esta ciudad.</p>";
            return;
        }

        comentariosFiltrados.forEach(c => {
            const commentItem = document.createElement("div");
            commentItem.classList.add("comment");
            commentItem.innerHTML = `<p><strong>Comentario:</strong> ${c.texto}</p>`;
            commentList.appendChild(commentItem);
        });
    }

    // Agregar un comentario
    function addComment() {
        const comentarioTexto = commentInput.value.trim();
        if (comentarioTexto === "") return;

        const ciudadSeleccionada = ciudadSelect.value;
        if (!ciudadSeleccionada) {
            alert("Selecciona una ciudad antes de dejar un comentario.");
            return;
        }

        // Agregar el comentario al array
        comentarios.push({
            ciudad: ciudadSeleccionada,
            texto: comentarioTexto
        });

        // Limpiar el campo de texto
        commentInput.value = "";

        // Mostrar los comentarios de la ciudad seleccionada
        mostrarComentarios(ciudadSeleccionada);
    }

    // Escuchar el evento de enviar comentario
    document.querySelector("button").addEventListener("click", addComment);
});
