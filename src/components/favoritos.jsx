import React, { createContext, useContext, useState, useEffect } from "react";
import "../styles/favoritos.css";

const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState(() => {
    const favs = localStorage.getItem("favoritos");
    return favs ? JSON.parse(favs) : [];
  });

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  function esFavorito(id) {
    const idStr = String(id);
    return favoritos.some(favId => String(favId) === idStr);
  }

  function toggleFavorito(id) {
    const idStr = String(id);
    setFavoritos(prev =>
      prev.some(favId => String(favId) === idStr)
        ? prev.filter(favId => String(favId) !== idStr)
        : [...prev, idStr]
    );
  }

  return (
    <FavoritosContext.Provider value={{ favoritos, esFavorito, toggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  return useContext(FavoritosContext);
}
