import React, { useEffect, useState } from "react";
import '../styles/clima.css';

const API_KEY = import.meta.env.VITE_CLIMA_API_KEY;

function formateaDia(fechaStr) {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" });
}

export default function Clima({ ciudad }) {
  const [dias, setDias] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ciudad) return;

    setDias([]);
    setError(null);

    const fetchClima = async () => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(ciudad)}&appid=${API_KEY}&units=metric&lang=es`;
        const res = await fetch(url);
        const datos = await res.json();

        if (datos.cod !== "200") {
          setError("No se pudo cargar el clima. Intenta más tarde.");
          return;
        }

        // Agrupa por día, solo uno por día
        const diasMostrados = [];
        const pronostico = [];
        for (let entrada of datos.list) {
          const dia = formateaDia(entrada.dt_txt);
          if (!diasMostrados.includes(dia)) {
            diasMostrados.push(dia);
            pronostico.push({
              dia,
              descripcion: entrada.weather[0].description,
              temp: entrada.main.temp,
              icon: entrada.weather[0].icon,
            });
            if (pronostico.length >= 5) break;
          }
        }
        setDias(pronostico);
      } catch (e) {
        setError("No se pudo cargar el clima. Intenta más tarde.");
      }
    };

    console.log("API KEY:", API_KEY);
console.log("Ciudad:", ciudad);


    fetchClima();
  }, [ciudad]);

  if (!ciudad) return null;

  return (
    <div id="clima" className="active">
      <h2>Clima en {ciudad}</h2>
      {error && <p>{error}</p>}
      <div className="clima-caja">
        {dias.map((dia) => (
          <div className="dia-clima" key={dia.dia}>
            <h3>{dia.dia}</h3>
            <img
              src={`https://openweathermap.org/img/wn/${dia.icon}@2x.png`}
              alt={dia.descripcion}
             
            />
            <p>
              <strong>{dia.descripcion}</strong>
            </p>
            <p>Temperatura: {dia.temp.toFixed(1)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
}
