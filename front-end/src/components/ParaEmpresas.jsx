import React from 'react';
// Continuaremos usando o App.css, então não precisamos de um CSS separado
// import '../ContentPage.css'; // Pode remover esta linha se usava antes

function ParaEmpresas() {
  return (
    // Usamos a classe 'container' que já existe no seu App.css
    <div id="empresas" className="container">
      <div className="para-empresas-page">
        {/* --- SEÇÃO DE INTRODUÇÃO VISUAL --- */}
        <section className="intro-section">
          <div className="intro-text">
            <h1>O Talento Certo para Sua Próxima Grande Inovação.</h1>
            <p>
              Publique sua vaga em nossa comunidade exclusiva de talentos em tecnologia e acelere seu processo de contratação.
            </p>
            <a href="#form-anuncio" className="cta-button">
              Anunciar Vaga
            </a>
          </div>
          <div className="intro-image">
            {/* Imagem de placeholder - troque pela sua imagem */}
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop" 
              alt="Equipe de tecnologia colaborando" 
            />
          </div>
        </section>

        {/* --- SEÇÃO DE BENEFÍCIOS COM CARDS --- */}
        <section className="benefits-section">
          <h2>Vantagens de Anunciar Conosco</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>Público Focado</h3>
              <p>Sua vaga é vista por profissionais que vivem e respiram tecnologia.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🚀</div>
              <h3>Processo Ágil</h3>
              <p>Publique sua vaga em minutos e comece a receber candidaturas qualificadas.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">✨</div>
              <h3>Marca Empregadora</h3>
              <p>Fortaleça sua imagem em uma comunidade respeitada no mercado tech.</p>
            </div>
          </div>
        </section>
        
        {/* --- FORMULÁRIO (Pode ser o componente que já criamos) --- */}
        {/* Aqui você pode renderizar o formulário de anúncio de vaga */}

      </div>
    </div>
  );
}

export default ParaEmpresas;