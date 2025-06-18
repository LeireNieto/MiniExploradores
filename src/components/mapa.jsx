import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import '../styles/styles.css'


export default function Mapa({ actividades }) {
  const defaultPosition = [43.2630, -2.9350];
  const position = actividades.length && actividades[0].lat && actividades[0].lng
    ? [actividades[0].lat, actividades[0].lng]
    : defaultPosition;

  // Estado para guardar qué popup está abierto (por índice)
  const [popupAbierto, setPopupAbierto] = useState(null);

  // Al cambiar actividades, cerramos cualquier popup abierto
  useEffect(() => {
    setPopupAbierto(null);
  }, [actividades]);

  return (
    <div className="mapa">
      <MapContainer key={actividades.length ? actividades[0].lat + "-" + actividades[0].lng : "default"}
        center={position}
        zoom={13}
        minZoom={5}
        maxZoom={12}
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
                <Popup
                  onClose={() => setPopupAbierto(null)}
                  autoClose={false} // Para controlar manualmente el cierre
                >
                  <strong>{a.nombre}</strong>
                  <br />
                  {a.ubicacion}
                </Popup>
              )}
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}
