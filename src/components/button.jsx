

import React from "react";
import '../styles/button.css';

function Button({ isActive, onToggle, textoActivo, textoInactivo, className = "" }) {
  return (
    <button onClick={onToggle} className={`button ${className}`}>
      {isActive ? textoActivo : textoInactivo}
    </button>
  );
}

export default Button;

