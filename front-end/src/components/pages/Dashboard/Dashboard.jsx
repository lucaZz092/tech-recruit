import React from 'react';
import './Dashboard.css';
import { FiSearch, FiBriefcase, FiUser, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'; // Ícones para dar um toque profissional
import JobCard from '../../JobCard'; // Reutilizando o nosso JobCard!

// Dados de exemplo que viriam do seu backend no futuro
const recommendedJobs = [
    { id: 101, jobTitle: "Engenheiro de DevOps Pleno", companyName: "CloudPioneers", jobTags: ["AWS", "Kubernetes", "Terraform"], },
    { id: 102, jobTitle: "Desenvolvedor(a) React Native Sênior", companyName: "MobileFirst Co.", jobTags: ["React Native", "TypeScript", "GraphQL"], },
];

function Dashboard() {
  // O seu onJobCardClick viria como uma prop de App.js se quiser abrir o modal de login daqui também
  const handleCardClick = () => {
    console.log("Card de vaga clicado no dashboard!");
    // Aqui você abriria um modal com detalhes da vaga, não o de login.
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Olá, Lucas!</h1>
        <p>Encontre a sua próxima oportunidade e acompanhe as suas candidaturas.</p>
      </header>

      {/* --- BARRA DE PESQUISA --- */}
      <section className="search-bar-container">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Pesquisar por cargo, stack ou empresa" />
        </div>
        <button className="search-button">Pesquisar</button>
      </section>

      {/* --- CONTEÚDO PRINCIPAL (LAYOUT DE 2 COLUNAS) --- */}
      <div className="dashboard-main">
        <div className="main-content">
          <h2>Vagas Recomendadas para Você</h2>
          <div className="job-list">
            {recommendedJobs.map(job => (
              <JobCard 
                key={job.id}
                title={job.jobTitle}
                company={job.companyName}
                tags={job.jobTags}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </div>

        <aside className="sidebar">
          {/* --- WIDGET DE CANDIDATURAS --- */}
          <div className="widget-card">
            <h3><FiBriefcase /> Minhas Candidaturas</h3>
            <ul className="application-status">
              <li><FiCheckCircle className="icon-success" /> <strong>3</strong> Aplicadas</li>
              <li><FiClock className="icon-pending" /> <strong>1</strong> Em Análise</li>
              <li><FiAlertCircle className="icon-attention" /> <strong>0</strong> Ação Necessária</li>
            </ul>
          </div>

          {/* --- WIDGET DE PERFIL --- */}
          <div className="widget-card">
            <h3><FiUser /> Meu Perfil</h3>
            <p>O seu perfil está <strong>75%</strong> completo.</p>
            <div className="progress-bar">
              <div className="progress" style={{width: '75%'}}></div>
            </div>
            <a href="#" className="sidebar-link">Complete o seu perfil para aumentar as suas chances! →</a>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;