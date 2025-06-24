import React from "react";
import "../styles/modalform.css";

export default function ModalForm({ cerrarModal }) {
  // Cierra modal si clicas fuera del contenido
  const handleClickFuera = (e) => {
    if (e.target.id === "formModal") {
      cerrarModal();
    }
  };

  return (
    <div id="formModal" onClick={handleClickFuera}>
      <div className="modal-content">
        <button
          id="closeFormBtn"
          onClick={cerrarModal}
          aria-label="Cerrar formulario"
        >
          &times;
        </button>

        <h2>Formulario</h2>
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
            <input type="text" name="Comentario" />
          </label>

          <div className="submit-container">
            <button type="submit">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
