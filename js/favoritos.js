export function obtenerFavoritos() {
    const favs = localStorage.getItem("favoritos");
    return favs ? JSON.parse(favs) : [];
}

export function guardarFavoritos(favoritos) {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

export function esFavorito(id) {
    const favoritos = obtenerFavoritos();
    return favoritos.includes(id);
}

export function toggleFavorito(id) {
    const favoritos = obtenerFavoritos();
    const index = favoritos.indexOf(id);
    if (index === -1) {
        favoritos.push(id);
    } else {
        favoritos.splice(index, 1);
    }
    guardarFavoritos(favoritos);
    return index === -1; // Devuelve true si se añadió, false si se quitó
}
