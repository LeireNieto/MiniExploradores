import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [ciudad, setCiudad] = useState("");
  const [showClima, setShowClima] = useState(false);
  const [showMapa, setShowMapa] = useState(false);

  // ¡Agregado el estado que faltaba!
  const [actividades, setActividades] = useState([]);

  return (
    <AppContext.Provider
      value={{
        ciudad,
        setCiudad,
        showClima,
        setShowClima,
        showMapa,
        setShowMapa,
        actividades,
        setActividades,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
