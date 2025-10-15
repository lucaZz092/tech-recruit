import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1>Página não encontrada</h1>
        <p>
          Ops! A página que você está procurando não existe ou foi removida.
        </p>
        
        <div className="not-found-actions">
          <button 
            className="home-btn" 
            onClick={() => navigate('/')}
          >
            🏠 Voltar ao Início
          </button>
          <button 
            className="dashboard-btn" 
            onClick={() => navigate('/dashboard')}
          >
            💼 Ver Vagas
          </button>
        </div>

        <div className="suggestions">
          <h3>Sugestões:</h3>
          <ul>
            <li>Verifique se o URL está correto</li>
            <li>Navegue de volta para a página inicial</li>
            <li>Explore nossas vagas no dashboard</li>
            <li>Entre em contato se o problema persistir</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
