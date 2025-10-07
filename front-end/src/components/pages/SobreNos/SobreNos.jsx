import React from 'react';
import './SobreNos.css';
// O CSS será adicionado ao App.css, então não precisamos de um import separado aqui

function SobreNos() {
  return (
    // Reutilizamos a classe 'container' do seu App.css
    <div id="sobre-nos" className="container">
      <div className="sobre-nos-page"> 
        {/* --- SEÇÃO DE INTRODUÇÃO VISUAL --- */}
        <section className="intro-section">
          <div className="intro-text">
            <h1>Nossa Missão é Conectar Pessoas e Propósitos.</h1>
            <p>
              Somos mais que um portal de vagas. Somos uma comunidade dedicada a construir o futuro da tecnologia, uma conexão de cada vez.
            </p>
          </div>
          <div className="intro-image">
            {/* Imagem de placeholder - troque por uma foto da equipe ou do escritório */}
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1740&auto=format&fit=crop" 
              alt="Comunidade de tecnologia em um evento" 
            />
          </div>
        </section>

        {/* --- SEÇÃO DE VALORES COM CARDS --- */}
        <section className="values-section">
          <h2>O que nos Guia</h2>
          <div className="benefits-grid"> {/* Reutilizando a classe do grid */}
            <div className="benefit-card">
              <div className="benefit-icon">🏆</div>
              <h3>Qualidade Acima de Tudo</h3>
              <p>Focamos em curar as melhores oportunidades em empresas inovadoras e com cultura forte.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h3>Transparência Radical</h3>
              <p>Incentivamos a comunicação aberta para eliminar as "caixas-pretas" dos processos seletivos.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💡</div>
              <h3>Inovação Contínua</h3>
              <p>Estamos sempre aprimorando nossa plataforma para uma experiência mais inteligente e eficaz.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default SobreNos;