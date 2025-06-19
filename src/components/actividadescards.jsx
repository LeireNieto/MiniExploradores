import React, { useState } from "react";
import { useFavoritos } from "./favoritos"; // Ajusta ruta si es necesario
import "../styles/actividadescards.css";

export default function ActividadCard({ actividad }) {
  const [flip, setFlip] = useState(false);
  const { esFavorito, toggleFavorito } = useFavoritos();

  const marcado = esFavorito(actividad.id);

  return (
    <div className={`card actividad-card${flip ? " flip" : ""}`}>
      <div className="card-inner">
        <div className="card-front">
          <img src={`/imagenes/${actividad.imagen}`} alt={actividad.nombre} />
          <h3>{actividad.nombre}</h3>

          <div className="card-front-bottom">
            <button
              className={`fav-btn${marcado ? " marcado" : ""}`}
              onClick={() => toggleFavorito(actividad.id)}
              aria-label={marcado ? "Quitar de favoritos" : "Agregar a favoritos"}
              type="button"
            >
              ♥
            </button>
            <button className="flip-btn" onClick={() => setFlip(!flip)}>
              🔄
            </button>
          </div>
        </div>

        <div className="card-back">
          <p>{actividad.descripcion}</p>
          <p><strong>Edad recomendada:</strong> {actividad.edad}</p>
          <p><strong>Precio:</strong> {actividad.precio}</p>
          <p><strong>Ubicación:</strong> {actividad.ubicacion}</p>
          {actividad.enlace && (
            <a href={actividad.enlace} target="_blank" rel="noopener noreferrer">
              Más información
            </a>
          )}

          <button className="flip-btn" onClick={() => setFlip(!flip)}>
            🔄
          </button>
        </div>
      </div>
    </div>
  );
}
