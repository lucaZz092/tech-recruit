import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'; 

// --- Componentes Reutilizáveis ---
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedJobs from './components/FeaturedJobs';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal/LoginModal';
import TechStack from './components/TechStack';

// --- Páginas ---
import ParaEmpresas from './components/pages/ParaEmpresas/ParaEmpresas';
import SobreNos from './components/pages/SobreNos/SobreNos';
import Dashboard from './components/pages/Dashboard/Dashboard';

// Componente para a Página Inicial
function HomePage({ onJobCardClick }) { // <- Recebe a prop aqui
  return (
    <>
      <Hero />
      <TechStack />
      {/* E passa a prop para o FeaturedJobs aqui */}
      <FeaturedJobs onJobCardClick={onJobCardClick} />
      <ParaEmpresas />
      <SobreNos />
    </>
  );
}

function App() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            {/* A função openLoginModal é passada para a HomePage aqui */}
            <Route path="/" element={<HomePage onJobCardClick={openLoginModal} />} />
            <Route path="/empresas" element={<ParaEmpresas />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
        <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      </div>
    </Router>
  );
}

export default App;