import React from 'react';
import '../styles/header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="logo-titulo">
        <img src="logo.png" alt="Logo" className="logo" />
        <h1>Mini Exploradores</h1>
      </div>
      <div className="contact-links">
        <a
          href="mailto:miniexploradoresweb@gmail.com"
          className="email-link"
          title="Enviar email"
        >
          <i className="fas fa-envelope"></i>
        </a>
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
    </header>
  );
}
