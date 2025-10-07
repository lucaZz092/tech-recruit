import React from 'react';
import TextType from './TextType/TextType'; // Importe o novo componente

function Hero() {
  // Crie um array com as frases que você quer animar
  const typingTexts = [
    "Conectando Talentos à Inovação.",
    "Sua Próxima Oportunidade Tech.",
    "Encontre Vagas de Alto Nível.",
  ];

  return (
    <section className="hero">
      <div className="container">
        {/* Substitua o h1 estático pelo componente TextType */}
        <TextType 
          as="h1" // Renderiza como <h1>
          text={typingTexts}
          typingSpeed={70}
          deletingSpeed={50}
          pauseDuration={2000}
        />
        <p>O lugar ideal para encontrar sua próxima oportunidade no universo da tecnologia.</p>
        <a 
          href="#vagas" 
          className="button-vagas"
        >
          Explorar Vagas
        </a>
      </div>
    </section>
  );
}

export default Hero;