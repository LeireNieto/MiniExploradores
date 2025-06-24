import React from "react";
import '../styles/button.css';

function Button({ isActive, onToggle, textoActivo, textoInactivo, icon, className = "" }) {
  return (
    <button className={`button ${className} ${isActive ? "activo" : ""}`} onClick={onToggle}>
      {icon}
      <span className="boton-texto">
        {isActive ? textoActivo : textoInactivo}
      </span>
    </button>
  );
}

export default Button;
