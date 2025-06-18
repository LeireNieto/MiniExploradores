import React, { useEffect, useState } from "react";
import ActividadCard from "./actividadescards";
import FiltroCiudad from './filtrociudad';
import Mapa from "./mapa";
import Clima from "./clima";
import Button from "./button";
import '../styles/styles.css'
import '../styles/actividades.css';

function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [ciudad, setCiudad] = useState("");
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [mostrarClima, setMostrarClima] = useState(false);

  useEffect(() => {
    fetch("/actividades.json")
      .then(res => res.json())
      .then(data => setActividades(data));
  }, []);

  const actividadesFiltradas = ciudad
    ? actividades.filter(a => normalize(a.ciudad) === normalize(ciudad))
    : [];

  return (
    <div className="actividades-pagina">
  
      <div className="filtro-botones">
        <FiltroCiudad ciudad={ciudad} setCiudad={setCiudad} />
        <Button
          isActive={mostrarMapa}
          onToggle={() => setMostrarMapa(m => !m)}
          textoActivo="Ocultar mapa"
          textoInactivo="Ver mapa"
        />
        <Button
          isActive={mostrarClima}
          onToggle={() => setMostrarClima(c => !c)}
          textoActivo="Ocultar clima"
          textoInactivo="Ver clima"
        />
      </div>

      {ciudad === "" && <p>Selecciona una ciudad para ver las actividades.</p>}
      {ciudad !== "" && actividadesFiltradas.length === 0 && (
        <p>No hay actividades para esta ciudad.</p>
      )}

      {ciudad !== "" && actividadesFiltradas.length > 0 && (
        <div className="actividades-lista">
          {actividadesFiltradas.map((actividad, idx) => (
            <ActividadCard key={idx} actividad={actividad} />
          ))}
        </div>
      )}

      <div className="info-extra">
        {mostrarMapa && (
          <div className="mapa">
            <Mapa actividades={actividadesFiltradas} />
          </div>
        )}
        {mostrarClima && (
          <div className="clima">
            <Clima ciudad={ciudad} />
          </div>
        )}
      </div>
    </div>
  );
}
