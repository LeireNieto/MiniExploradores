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
    <div
      id="formModal"
      onClick={handleClickFuera}
       >
      <div>
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
          <br />
          <label>
            Email:
            <input type="email" name="Email" />
          </label>
          <br />
          <label>
            Comentario:
            <input type="text" name="Comentario" />
          </label>
          <br />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}
