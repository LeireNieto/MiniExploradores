import React, { useEffect, useState } from "react";
import FiltroCiudad from "./filtrociudad";
import ActividadCard from "./actividadescards";
import Button from "./button";
import Mapa from "./mapa";
import Clima from "./clima";
import { useAppContext } from "./appcontext";
import { useFavoritos } from "./favoritos";
import "../styles/actividades.css";

function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function Actividades() {
  const { ciudad, setCiudad } = useAppContext();
  const [actividades, setActividades] = useState([]);
  const { favoritos } = useFavoritos();

  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [mostrarClima, setMostrarClima] = useState(false);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  useEffect(() => {
    fetch("./actividades.json")
      .then((res) => res.json())
      .then((data) => {
        setActividades(data.flat());
      })
      .catch((err) => console.error("Error cargando actividades:", err));
  }, []);

  const actividadesFiltradas = ciudad
    ? actividades.filter((a) => normalize(a.ciudad) === normalize(ciudad))
    : [];

  const mostrarListaActividades =
    !mostrarMapa && !mostrarClima && !mostrarFavoritos && ciudad !== "";

  // Filtrar las actividades favoritas
  const actividadesFavoritas = actividades.filter((a) =>
    favoritos.includes(a.id)
  );

  // Agrupar favoritos por ciudad
  const favoritosPorCiudad = actividadesFavoritas.reduce((acc, actividad) => {
    if (!acc[actividad.ciudad]) acc[actividad.ciudad] = [];
    acc[actividad.ciudad].push(actividad);
    return acc;
  }, {});

  return (
    <div className="actividades-pagina">
      <div className="filtro-botones">
        <FiltroCiudad ciudad={ciudad} setCiudad={setCiudad} />
        <Button
          isActive={mostrarMapa}
          onToggle={() => {
            setMostrarMapa((m) => !m);
            setMostrarClima(false);
            setMostrarFavoritos(false);
          }}
          textoActivo="Ocultar mapa"
          textoInactivo="Ver mapa"
        />
        <Button
          isActive={mostrarClima}
          onToggle={() => {
            setMostrarClima((c) => !c);
            setMostrarMapa(false);
            setMostrarFavoritos(false);
          }}
          textoActivo="Ocultar clima"
          textoInactivo="Ver clima"
        />
        <Button
          isActive={mostrarFavoritos}
          onToggle={() => {
            setMostrarFavoritos((f) => !f);
            setMostrarMapa(false);
            setMostrarClima(false);
          }}
          textoActivo={`Ocultar favoritos (${favoritos.length})`}
          textoInactivo={`Ver favoritos (${favoritos.length})`}
        />
      </div>

      {ciudad === "" && !mostrarFavoritos && (
        <p>Selecciona una ciudad para ver las actividades.</p>
      )}

      {mostrarListaActividades && actividadesFiltradas.length === 0 && (
        <p>No hay actividades para esta ciudad.</p>
      )}

      {mostrarListaActividades && actividadesFiltradas.length > 0 && (
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
        {mostrarFavoritos && (
          <div className="favoritos-lista">
            {favoritos.length === 0 ? (
              <p>No tienes favoritos seleccionados.</p>
            ) : (
              Object.entries(favoritosPorCiudad).map(([ciudadNombre, actividades]) => (
                <div key={ciudadNombre} className="favoritos-por-ciudad">
                  <h2>{ciudadNombre}</h2>
                  <div className="actividades-lista">
                    {actividades.map((actividad, idx) => (
                      <ActividadCard key={idx} actividad={actividad} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
