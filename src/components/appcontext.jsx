import React, { createContext, useState, useContext } from "react";
import '../styles/styles.css'

const AppContext = createContext();

export function AppProvider({ children }) {
  const [ciudad, setCiudad] = useState("");
  const [showClima, setShowClima] = useState(false);
  const [showMapa, setShowMapa] = useState(false);

  return (
    <AppContext.Provider
      value={{
        ciudad,
        setCiudad,
        showClima,
        setShowClima,
        showMapa,
        setShowMapa
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
