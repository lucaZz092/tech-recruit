import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { FiSearch, FiBriefcase, FiUser, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import JobCard from '../../JobCard';
import JobDetailModal from '../../JobDetailModal/JobDetailModal';
import { getJobs, getRandomJobs } from '../../../services/api';

function Dashboard() {
  // Estados para os filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  
  // Estados para as vagas
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para o modal de detalhes
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  
  // Estados para controlar a exibição de vagas
  const [displayedJobs, setDisplayedJobs] = useState(6);
  const [showMore, setShowMore] = useState(true);

  // Dados de fallback
  const fallbackJobs = [
    { id: 101, jobTitle: "Engenheiro de DevOps Pleno", companyName: "CloudPioneers", jobTags: ["AWS", "Kubernetes", "Terraform"] },
    { id: 102, jobTitle: "Desenvolvedor(a) React Native Sênior", companyName: "MobileFirst Co.", jobTags: ["React Native", "TypeScript", "GraphQL"] },
    { id: 103, jobTitle: "Full Stack Developer", companyName: "TechStartup", jobTags: ["JavaScript", "Python", "React"] }
  ];

  const handleCardClick = (jobId) => {
    console.log("Abrindo detalhes da vaga:", jobId);
    
    // Encontrar a vaga completa pelo ID
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setIsJobModalOpen(true);
    }
  };

  const closeJobModal = () => {
    setIsJobModalOpen(false);
    setSelectedJob(null);
  };

  // Função para buscar vagas com filtros
  const fetchJobsWithFilters = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Buscando vagas com filtros:', {
        searchTerm,
        tech: selectedTech,
        location: selectedLocation,
        level: selectedLevel
      });

      // Verificar se algum filtro está aplicado
      const hasFilters = selectedTech || selectedLocation || selectedLevel || searchTerm;

      if (!hasFilters) {
        // Nenhum filtro aplicado - buscar vagas aleatórias da API
        console.log('🎲 Nenhum filtro aplicado - buscando vagas aleatórias...');
        const response = await getRandomJobs(25);
        
        if (response.success) {
          const formattedJobs = response.data.map(job => ({
            id: job.id,
            jobTitle: job.jobTitle,
            companyName: job.companyName,
            jobTags: job.jobTags || ['Remote'],
            // Dados completos para o modal
            url: job.url,
            companyLogo: job.companyLogo,
            jobGeo: job.jobGeo,
            jobType: job.jobType,
            jobLevel: job.jobLevel,
            jobIndustry: job.jobIndustry,
            jobExcerpt: job.jobExcerpt,
            jobDescription: job.jobDescription,
            salary: job.salary,
            isRemote: job.isRemote,
            source: job.source
          }));

          setJobs(formattedJobs);
          console.log(`✅ ${formattedJobs.length} vagas aleatórias carregadas da API`);
        }
        return;
      }

      // Construindo parâmetros para a API local
      const filters = {
        limit: 10,
        page: 1
      };
      
      if (searchTerm) {
        filters.search = searchTerm;
      }
      
      if (selectedTech) {
        filters.technology = selectedTech;
      }
      
      if (selectedLocation) {
        filters.location = selectedLocation;
      }
      
      if (selectedLevel) {
        filters.level = selectedLevel;
      }

      console.log('🌐 Filtros da API:', filters);

      const response = await getJobs(filters);
      
      if (!response.success) {
        throw new Error(response.error || 'Erro ao buscar vagas');
      }
      
      console.log('📊 Dados recebidos:', response);
      
      if (!response.data || response.data.length === 0) {
        throw new Error('Nenhuma vaga encontrada com os filtros selecionados');
      }

      // Formatar dados mantendo todas as informações para o modal
      const formattedJobs = response.data.map(job => ({
        id: job.id,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        jobTags: job.jobTags || [job.jobLevel, job.jobGeo].filter(Boolean) || ['Remote'],
        // Dados completos para o modal
        url: job.url,
        companyLogo: job.companyLogo,
        jobGeo: job.jobGeo,
        jobType: job.jobType,
        jobLevel: job.jobLevel,
        jobIndustry: job.jobIndustry,
        jobExcerpt: job.jobExcerpt,
        jobDescription: job.jobDescription,
        pubDate: job.pubDate
      }));

      setJobs(formattedJobs);
      console.log('✅ Vagas carregadas:', formattedJobs.length);

    } catch (err) {
      console.error('❌ Erro ao buscar vagas:', err);
      console.log('🔄 Usando dados de fallback...');
      setJobs(fallbackJobs);
      setError(`Usando dados exemplo: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchJobsWithFilters();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTech('');
    setSelectedLocation('');
    setSelectedLevel('');
    console.log('🧹 Filtros limpos - carregando vagas padrão...');
    // Recarregar vagas padrão após limpar filtros
    setTimeout(() => {
      fetchJobsWithFilters();
    }, 100);
  };

  // Função removida - agora usamos a API local

  // Carregar vagas iniciais ao montar o componente
  useEffect(() => {
    console.log('🚀 Dashboard montado - carregando vagas iniciais...');
    fetchJobsWithFilters();
  }, []);

  // Reset displayedJobs quando filtros mudarem
  useEffect(() => {
    setDisplayedJobs(6);
  }, [selectedTech, selectedLocation, selectedLevel, searchTerm]);

  return (
    <div className="dashboard-container">
      {/* --- HEADER SIMPLIFICADO --- */}
      <header className="dashboard-header">
        <h1>Painel de Vagas</h1>
        <p>Conectamos você às melhores oportunidades em tecnologia</p>
      </header>

      {/* --- BARRA DE PESQUISA COM FILTROS --- */}
      <section className="search-section">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Busque por tecnologia, cargo ou empresa..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleApplyFilters();
              }
            }}
          />
          <button className="search-btn" onClick={handleApplyFilters}>
            Buscar Vagas
          </button>
        </div>
        
        {/* --- FILTROS AVANÇADOS --- */}
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="tech-filter">Tecnologias</label>
            <select 
              id="tech-filter" 
              className="filter-select"
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
            >
              <option value="">Todas as tecnologias</option>
              <option value="react">React</option>
              <option value="vue">Vue.js</option>
              <option value="angular">Angular</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="node">Node.js</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="golang">Go</option>
              <option value="docker">Docker</option>
              <option value="kubernetes">Kubernetes</option>
              <option value="aws">AWS</option>
              <option value="azure">Azure</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="location-filter">Localização</label>
            <select 
              id="location-filter" 
              className="filter-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Qualquer local</option>
              <option value="remote">100% Remoto</option>
              <option value="usa">Estados Unidos</option>
              <option value="canada">Canadá</option>
              <option value="uk">Reino Unido</option>
              <option value="germany">Alemanha</option>
              <option value="brazil">Brasil</option>
              <option value="portugal">Portugal</option>
              <option value="spain">Espanha</option>
              <option value="netherlands">Holanda</option>
              <option value="australia">Austrália</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="level-filter">Nível do Cargo</label>
            <select 
              id="level-filter" 
              className="filter-select"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">Todos os níveis</option>
              <option value="junior">Júnior (0-2 anos)</option>
              <option value="mid-level">Pleno (2-5 anos)</option>
              <option value="senior">Sênior (5+ anos)</option>
              <option value="lead">Tech Lead</option>
              <option value="manager">Gerente</option>
              <option value="director">Diretor</option>
              <option value="c-level">C-Level</option>
            </select>
          </div>

          <div className="filter-group">
            <button className="filter-apply-btn" onClick={handleApplyFilters}>
              Aplicar Filtros
            </button>
            <button className="filter-clear-btn" onClick={handleClearFilters}>
              Limpar
            </button>
          </div>
        </div>
      </section>

      {/* --- STATUS RÁPIDO --- */}
      <div className="quick-stats">
        <div className="stat-card">
          <FiBriefcase />
          <span>3 Candidaturas</span>
        </div>
        <div className="stat-card">
          <FiClock />
          <span>1 Em Análise</span>
        </div>
        <div className="stat-card">
          <FiCheckCircle />
          <span>Perfil 75%</span>
        </div>
      </div>

      {/* --- VAGAS FILTRADAS --- */}
      <section className="jobs-section">
        <h2>
          {selectedTech || selectedLocation || selectedLevel || searchTerm 
            ? 'Vagas Encontradas' 
            : 'Vagas em Destaque'
          }
        </h2>
        <p className="section-subtitle">
          {isLoading 
            ? 'Buscando vagas...' 
            : error 
            ? error 
            : selectedTech || selectedLocation || selectedLevel || searchTerm
            ? `${jobs.length} vagas encontradas que combinam com seus filtros`
            : `${jobs.length} vagas de diferentes tecnologias selecionadas para você`
          }
        </p>
        
        {/* Mostrar tecnologias em destaque quando não há filtros */}
        {!isLoading && !error && !(selectedTech || selectedLocation || selectedLevel || searchTerm) && jobs.length > 0 && (
          <div className="featured-techs">
            <p className="featured-techs-label">Tecnologias em destaque:</p>
            <div className="tech-indicators">
              {[...new Set(jobs.map(job => job.sourceTech).filter(Boolean))].map(tech => (
                <span key={tech} className="tech-indicator">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="jobs-grid">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando vagas...</p>
            </div>
          ) : jobs.length > 0 ? (
            jobs.slice(0, displayedJobs).map(job => (
              <JobCard 
                key={job.id}
                title={job.jobTitle}
                company={job.companyName}
                tags={job.jobTags}
                onCardClick={() => handleCardClick(job.id)}
              />
            ))
          ) : (
            <div className="no-jobs-message">
              <p>Nenhuma vaga encontrada com os filtros selecionados.</p>
              <button onClick={handleClearFilters} className="clear-filters-btn">
                Limpar filtros e ver todas as vagas
              </button>
            </div>
          )}
        </div>
        
        {/* Botão Ver Mais */}
        {!isLoading && jobs.length > displayedJobs && (
          <div className="show-more-container">
            <button 
              onClick={() => setDisplayedJobs(prev => prev + 6)}
              className="show-more-btn"
            >
              Ver Mais Vagas ({jobs.length - displayedJobs} restantes)
            </button>
          </div>
        )}
      </section>

      {/* Modal de Detalhes da Vaga */}
      <JobDetailModal 
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={closeJobModal}
      />

    </div>
  );
}

export default Dashboard;