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
    return favoritos.includes(id);
  }

  function toggleFavorito(id) {
    setFavoritos(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
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
