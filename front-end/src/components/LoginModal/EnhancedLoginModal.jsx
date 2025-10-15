import React, { useState } from 'react';
import './LoginModal.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Se o modal não estiver aberto, não renderize nada.
  if (!isOpen) {
    return null;
  }

  // Função para evitar que o clique dentro do modal o feche.
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // Manipular mudanças nos inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro específico quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validar formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!isLoginMode) {
      if (!formData.name) {
        newErrors.name = 'Nome é obrigatório';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para lidar com o submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let result;
      
      if (isLoginMode) {
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }

      if (result.success) {
        onClose(); // Fecha o modal
        navigate('/dashboard'); // Navega para o dashboard
      } else {
        setErrors({ general: result.error || 'Erro no servidor' });
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setErrors({ general: 'Erro de conexão. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Alternar entre login e registro
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    // O "overlay" é o fundo escuro que cobre a página
    <div className="modal-overlay" onClick={onClose}>
      
      {/* O conteúdo principal do modal */}
      <div className="modal-content enhanced-modal" onClick={handleModalContentClick}>
        
        {/* Botão de fechar no canto */}
        <button className="modal-close-button" onClick={onClose}>×</button>
        
        <h2>{isLoginMode ? 'Olá! Seja Bem-Vindo(a)!' : 'Crie sua Conta'}</h2>
        <p className="modal-subtitle">
          {isLoginMode ? 'Faça login para continuar' : 'Junte-se à nossa comunidade'}
        </p>

        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="name">Nome Completo</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="seuemail@exemplo.com"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder={isLoginMode ? "Sua senha" : "Mínimo 6 caracteres"}
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
          )}
          
          {isLoginMode && (
            <a href="#" className="forgot-password">Esqueceu sua senha?</a>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : (isLoginMode ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>

        <p className="signup-link">
          {isLoginMode ? (
            <>
              Não tem uma conta?{' '}
              <button type="button" onClick={toggleMode} className="toggle-link">
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{' '}
              <button type="button" onClick={toggleMode} className="toggle-link">
                Faça login
              </button>
            </>
          )}
        </p>

        <div className="demo-credentials">
          <p><strong>🧪 Para testar:</strong></p>
          <p>Email: <code>demo@teste.com</code></p>
          <p>Senha: <code>123456</code></p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
