import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, isAuthenticated, getStoredUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificar se usuário está logado ao inicializar
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const authenticated = isAuthenticated();
        const storedUser = getStoredUser();
        
        if (authenticated && storedUser) {
          setUser(storedUser);
          setIsLoggedIn(true);
          console.log('✅ Usuário autenticado:', storedUser.name);
        } else {
          console.log('❌ Usuário não autenticado');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Função de login
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      console.log('🔐 Tentando fazer login...');
      
      const response = await apiLogin(credentials);
      
      if (response.success) {
        setUser(response.user);
        setIsLoggedIn(true);
        console.log('✅ Login realizado com sucesso:', response.user.name);
        return { success: true, user: response.user };
      } else {
        console.error('❌ Erro no login:', response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('❌ Erro de conexão no login:', error);
      return { 
        success: false, 
        error: 'Erro de conexão. Verifique se o servidor está rodando.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Função de registro
  const register = async (userData) => {
    try {
      setIsLoading(true);
      console.log('📝 Tentando registrar usuário...');
      
      const response = await apiRegister(userData);
      
      if (response.success) {
        setUser(response.user);
        setIsLoggedIn(true);
        console.log('✅ Registro realizado com sucesso:', response.user.name);
        return { success: true, user: response.user };
      } else {
        console.error('❌ Erro no registro:', response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('❌ Erro de conexão no registro:', error);
      return { 
        success: false, 
        error: 'Erro de conexão. Verifique se o servidor está rodando.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    try {
      apiLogout();
      setUser(null);
      setIsLoggedIn(false);
      console.log('👋 Usuário deslogado');
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { success: false, error: 'Erro ao fazer logout' };
    }
  };

  // Atualizar dados do usuário
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('👤 Dados do usuário atualizados');
  };

  const value = {
    // Estados
    user,
    isLoggedIn,
    isLoading,
    
    // Funções
    login,
    register,
    logout,
    updateUser,
    
    // Utilitários
    isAuthenticated: () => isLoggedIn,
    getUserRole: () => user?.role || 'user',
    getUserName: () => user?.name || 'Usuário',
    getUserEmail: () => user?.email || ''
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
