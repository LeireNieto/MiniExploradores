// Lógica abrir/cerrar modal del formulario
const openBtn = document.getElementById("openFormBtn");
const modal = document.getElementById("formModal");
const closeBtn = document.getElementById("closeFormBtn");

openBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Cerrar modal si se hace click fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
