// src/components/Hero.jsx
import React from 'react';

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Conectando Talentos à Inovação</h1>
        <p>O lugar ideal para encontrar sua próxima oportunidade no universo da tecnologia.</p>
        <a 
          href="#vagas" 
          className="button-vagas"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('vagas')?.scrollIntoView({
              behavior: 'smooth'
            });
          }}
        >
          Explorar Vagas
        </a>
      </div>
    </section>
  );
}

export default Hero;