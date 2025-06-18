import '../styles/styles.css'

const ciudades = [
  { value: "", label: "Selecciona una ciudad" },
  { value: "Bilbao", label: "Bilbao" },
  { value: "San Sebastián", label: "Donosti" },
  { value: "Vitoria", label: "Vitoria" },
  { value: "Santander", label: "Santander" },
  { value: "Pamplona", label: "Pamplona" },
  { value: "Logroño", label: "Logroño" },
];

export default function FiltroCiudad({ ciudad, setCiudad }) {
  return (
    <div className="filtro">
      <label htmlFor="ciudad" className="sr-only">
        Selecciona una ciudad
      </label>
      <select
        id="ciudad"
        value={ciudad}
        onChange={(e) => setCiudad(e.target.value)}
      >
        {ciudades.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
}
