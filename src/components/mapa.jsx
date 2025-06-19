import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/mapa.css";

// Configurar icono por defecto para que se vea el marcador
const iconDefault = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  iconSize: [25, 41],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

function AjustarMapa() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

export default function Mapa({ actividades }) {
  const defaultPosition = [43.2630, -2.9350];
  const position =
    actividades.length && actividades[0].lat && actividades[0].lng
      ? [actividades[0].lat, actividades[0].lng]
      : defaultPosition;

  const [popupAbierto, setPopupAbierto] = useState(null);

  useEffect(() => {
    setPopupAbierto(null);
  }, [actividades]);

  return (
    <div className="mapa">
      <MapContainer
        key={
          actividades.length
            ? actividades[0].lat + "-" + actividades[0].lng
            : "default"
        }
        center={position}
        zoom={13}
        minZoom={5}
        maxZoom={12}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {actividades.map((a, idx) =>
          a.lat && a.lng ? (
            <Marker
              key={idx}
              position={[a.lat, a.lng]}
              eventHandlers={{
                click: () => setPopupAbierto(idx),
              }}
            >
              {popupAbierto === idx && (
                <Popup onClose={() => setPopupAbierto(null)} autoClose={false}>
                  <strong>{a.nombre}</strong>
                  <br />
                  {a.ubicacion}
                </Popup>
              )}
            </Marker>
          ) : null
        )}
        <AjustarMapa />
      </MapContainer>
    </div>
  );
}
