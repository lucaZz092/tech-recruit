import React, { useState } from 'react';

// 1. Importando o CSS e os componentes
import './App.css'; 
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedJobs from './components/FeaturedJobs';
import ParaEmpresas from './components/ParaEmpresas'; // Assumindo que você moveu para a pasta pages
import SobreNos from './components/SobreNos';       // Assumindo que você moveu para a pasta pages
import Footer from './components/Footer';
import LoginModal from './components/loginModal';
import TechStack from './components/TechStack';


// Componente para a Página Inicial
function HomePage({ onJobCardClick }) {
  return (
    <>
      <Hero />
      <TechStack />
      <FeaturedJobs onJobCardClick={onJobCardClick} />
      <ParaEmpresas />
      <SobreNos />
    </>
  );
}

function App() {
  // 2. Estado para controlar a visibilidade do modal
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  // Funções para abrir e fechar o modal
  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  return (
    <div className="App">
      <Header />
      <main>
        {/* Página inicial com todas as seções */}
        <HomePage onJobCardClick={openLoginModal} />
      </main>
      <Footer />

      {/* O Modal fica aqui fora para flutuar sobre qualquer página */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
}

export default App;