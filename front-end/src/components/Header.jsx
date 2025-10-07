import React from 'react';

// 1. Receba a função 'onLoginClick' aqui, através das props
function Header({ onLoginClick }) {
  return (
    <header>
      <div className="container">
        <nav>
          <a href="/" className="logo">Tech Recruiter<span>;</span></a>
          <ul>
            <li><a href="/empresas">Para Empresas</a></li>
            <li><a href="/sobre-nos">Sobre Nós</a></li>
            <li><a href="/#">Teste</a></li>
            <li><a href="/#">Teste</a></li>
          </ul>
          {/* 2. Em vez de um link, usamos um botão que executa a função no onClick */}
          <button className="login-btn" onClick={onLoginClick}>
            Login
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;