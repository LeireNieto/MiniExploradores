import React, { useState } from "react";
import ModalForm from "./modalform";
import "../styles/header.css";

export default function Header() {
  const [modalAbierto, setModalAbierto] = useState(false);

  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => setModalAbierto(false);

  return (
    <header className="header">
      <div className="logo-titulo">
        <img src="logo.png" alt="Logo" className="logo" />
        <h1>Mini Exploradores</h1>
      </div>
      <div className="contact-links">
        <button
          className="email-link"
          title="Abrir formulario de contacto"
          onClick={abrirModal}
          
        >
          <i className="fas fa-envelope"></i>
        </button>
        {" | "}
        <a
          href="https://instagram.com/losminiexploradores"
          target="_blank"
          rel="noopener noreferrer"
          className="instagram-link"
          title="Instagram"
        >
          <i className="fab fa-instagram"></i>
        </a>
      </div>

      {modalAbierto && <ModalForm cerrarModal={cerrarModal} />}
    </header>
  );
}
