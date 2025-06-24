import React from "react";
import "../styles/modalform.css";

export default function ModalForm({ cerrarModal }) {
  const handleClickFuera = (e) => {
    if (e.target.id === "formModal") {
      cerrarModal();
    }
  };

  return (
    <div id="formModal" onClick={handleClickFuera}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          id="closeFormBtn"
          onClick={cerrarModal}
          aria-label="Cerrar formulario"
        >
          &times;
        </button>

        
        <form>
          <label>
            Nombre:
            <input type="text" name="Nombre" />
          </label>

          <label>
            Email:
            <input type="email" name="Email" />
          </label>

          <label>
            Comentario:
            <textarea name="Comentario" rows="5" />
          </label>

          <div className="submit-container">
            <button type="submit">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
