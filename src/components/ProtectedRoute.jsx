import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Loading from './Loading/Loading';

function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Loading message="Verificando autenticação..." size="large" />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
