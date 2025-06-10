let mapa;
let marcadores = [];

export function inicializarMapa() {
    const mapaElemento = document.getElementById("mapa");
    mapa = L.map(mapaElemento).setView([43.2630, -2.9350], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);
}

export function centrarMapa(lat, lng) {
    if (mapa) mapa.setView([lat, lng], 13);
}

export function limpiarMarcadores() {
    marcadores.forEach(m => mapa.removeLayer(m));
    marcadores = [];
}

export function agregarMarcador(lat, lng, contenido) {
    const marcador = L.marker([lat, lng]).addTo(mapa).bindPopup(contenido);
    marcadores.push(marcador);
}
