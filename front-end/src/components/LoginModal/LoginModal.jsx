import React from 'react';

function LoginModal({ isOpen, onClose }) {
  // Se o modal não estiver aberto, não renderize nada.
  if (!isOpen) {
    return null;
  }

  // Função para evitar que o clique dentro do modal o feche.
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // O "overlay" é o fundo escuro que cobre a página
    <div className="modal-overlay" onClick={onClose}>
      
      {/* O conteúdo principal do modal */}
      <div className="modal-content" onClick={handleModalContentClick}>
        
        {/* Botão de fechar no canto */}
        <button className="modal-close-button" onClick={onClose}>×</button>

        <h2>Olá! Seja Bem-Vindo(a)!</h2>
        <p className="modal-subtitle">Faça login para continuar</p>

        <form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="seuemail@exemplo.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" name="password" placeholder="Sua senha" required />
          </div>
          
          <a href="#" className="forgot-password">Esqueceu sua senha?</a>

          <button type="submit" className="login-button">Entrar</button>
        </form>

        <p className="signup-link">
          Não tem uma conta? <a href="#">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;