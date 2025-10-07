// src/components/Header.jsx
import React from 'react';

function Header() {
  return (
    <header>
      <nav className="container">
        <a href="#" className="logo">Tech Recruiter<span>;</span></a>
        <ul>
          <li><a href="#vagas">Vagas</a></li>
          <li><a href="#empresas">Para Empresas</a></li>
          <li><a href="#sobre-nos">Sobre Nós</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;