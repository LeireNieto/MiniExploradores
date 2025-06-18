

import React from "react";


function Button({ isActive, onToggle, textoActivo, textoInactivo, className = "" }) {
  return (
    <button onClick={onToggle} className={`button ${className}`}>
      {isActive ? textoActivo : textoInactivo}
    </button>
  );
}

export default Button;

