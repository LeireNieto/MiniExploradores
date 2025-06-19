import React from "react";
import '../styles/button.css';

function Button({ isActive, onToggle, textoActivo, textoInactivo, icon, className = "" }) {
  return (
    <button onClick={onToggle} className={`button ${className}`}>
      {icon && <span className="icon" style={{ marginRight: "8px" }}>{icon}</span>}
      {isActive ? textoActivo : textoInactivo}
    </button>
  );
}


export default Button;
