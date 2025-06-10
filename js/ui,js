export function mostrarMensaje(texto, tipo = "info") {
  const mensaje = document.createElement("div");
  mensaje.className = `mensaje-ui ${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 3000);
}

export function limpiarContenedor(id) {
  const contenedor = document.getElementById(id);
  if (contenedor) contenedor.innerHTML = "";
}

export function actualizarBotonFavoritos(mostrandoFavoritos) {
  const btn = document.getElementById("verFavoritosBtn");
  if (btn) {
      btn.innerHTML = mostrandoFavoritos
          ? '<i class="fas fa-heart"></i> Mostrar todo'
          : '<i class="fas fa-heart"></i> Ver favoritos';
  }
}

export function toggleBotonMapa(mostrando) {
  const btn = document.getElementById("verMapaBtn");
  if (btn) {
      btn.innerHTML = mostrando
          ? '<i class="fas fa-times-circle"></i> Ocultar mapa'
          : '<i class="fas fa-map-marker-alt"></i> Ver ubicaciones';
  }
}

export function toggleElemento(id, visible) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.style.display = visible ? "block" : "none";
}
