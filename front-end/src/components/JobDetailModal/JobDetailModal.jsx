import React from 'react';
import './JobDetailModal.css';
import { FiX, FiExternalLink, FiMapPin, FiClock, FiBriefcase, FiDollarSign } from 'react-icons/fi';

function JobDetailModal({ job, isOpen, onClose }) {
  if (!isOpen || !job) {
    return null;
  }

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const handleSubmitOnSite = () => {
    console.log('� Redirecionamento inteligente iniciado...');
    
    // Estratégia: Tentar URL direta da empresa primeiro
    const directUrl = generateDirectJobUrl(job);
    const company = job.companyName?.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Lista de empresas com URLs verificadas (alta confiabilidade)
    const verifiedCompanies = [
      'google', 'microsoft', 'amazon', 'meta', 'facebook', 'netflix', 
      'spotify', 'airbnb', 'uber', 'tesla', 'apple', 'shopify', 
      'stripe', 'github', 'gitlab', 'salesforce', 'adobe'
    ];
    
    if (directUrl && verifiedCompanies.includes(company)) {
      console.log('✅ Empresa verificada - redirecionando diretamente:', directUrl);
      window.open(directUrl, '_blank');
    } else if (directUrl) {
      console.log('🎯 Tentando URL da empresa (não verificada):', directUrl);
      
      // Para empresas não verificadas, abrir em nova aba e também mostrar opção do Jobicy
      window.open(directUrl, '_blank');
      
      // Mostrar notificação opcional
      setTimeout(() => {
        const useJobicy = confirm(
          `Tentamos te levar direto para ${job.companyName}.\n\n` +
          `Se a página não carregou corretamente, clique OK para usar o Jobicy como alternativa.`
        );
        
        if (useJobicy) {
          window.open(job.url, '_blank');
        }
      }, 2000);
      
    } else {
      console.log('🔄 Nenhuma URL direta encontrada - usando Jobicy');
      window.open(job.url, '_blank');
    }
  };



  // Função para gerar URLs diretas baseado em padrões comuns
  const generateDirectJobUrl = (job) => {
    if (!job.companyName) return null;
    
    const company = job.companyName.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '')
      .replace(/(inc|corp|ltd|llc|co)$/, '');
    
    console.log('🏢 Processando empresa:', job.companyName, '->', company);
    
    // Base de dados de empresas conhecidas com URLs verificadas
    const knownCompanies = {
      // Big Tech
      'google': 'https://careers.google.com',
      'microsoft': 'https://careers.microsoft.com',
      'amazon': 'https://amazon.jobs',
      'meta': 'https://careers.meta.com',
      'facebook': 'https://careers.meta.com',
      'netflix': 'https://jobs.netflix.com',
      'spotify': 'https://jobs.spotify.com',
      'airbnb': 'https://careers.airbnb.com',
      'uber': 'https://careers.uber.com',
      'tesla': 'https://careers.tesla.com',
      'apple': 'https://jobs.apple.com',
      'shopify': 'https://careers.shopify.com',
      'stripe': 'https://stripe.com/jobs',
      'github': 'https://github.com/careers',
      'gitlab': 'https://about.gitlab.com/jobs',
      
      // Startups populares
      'kubikware': 'https://kubikware.com/careers',
      'covergo': 'https://careers.covergo.com',
      'techmagic': 'https://www.techmagic.co/careers',
      'akamai': 'https://careers.akamai.com',
      
      // Plataformas conhecidas
      'greenhouse': 'https://greenhouse.io/careers',
      'lever': 'https://jobs.lever.co',
      'workday': 'https://careers.workday.com',
      'salesforce': 'https://careers.salesforce.com',
    };
    
    // Verifica se é uma empresa conhecida
    if (knownCompanies[company]) {
      console.log('✅ Empresa conhecida encontrada:', knownCompanies[company]);
      return knownCompanies[company];
    }
    
    // Padrões mais prováveis primeiro
    const priorityPatterns = [
      `https://careers.${company}.com`,
      `https://${company}.com/careers`,
      `https://jobs.${company}.com`,
      `https://${company}.com/jobs`,
    ];
    
    // Plataformas de recrutamento populares
    const platformPatterns = [
      `https://boards.greenhouse.io/${company}`,
      `https://jobs.lever.co/${company}`,
      `https://${company}.greenhouse.io`,
      `https://${company}.lever.co`,
      `https://apply.workable.com/${company}`,
      `https://${company}.breezy.hr`,
      `https://${company}.bamboohr.com/careers`,
    ];
    
    // Tentar o padrão mais comum primeiro
    const mostLikelyUrl = priorityPatterns[0];
    console.log('🎯 URL mais provável:', mostLikelyUrl);
    
    return mostLikelyUrl;
  };

  // Função para limpar HTML das descrições
  const cleanDescription = (html) => {
    if (!html) return 'Descrição não disponível.';
    return html.replace(/<[^>]*>/g, '').substring(0, 500) + '...';
  };

  return (
    <div className="job-modal-overlay" onClick={onClose}>
      <div className="job-modal-content" onClick={handleModalContentClick}>
        
        {/* Header do Modal */}
        <div className="job-modal-header">
          <button className="job-modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="job-modal-body">
          
          {/* Logo e Info Principal */}
          <div className="job-main-info">
            {job.companyLogo && (
              <img 
                src={job.companyLogo} 
                alt={`${job.companyName} logo`}
                className="company-logo"
              />
            )}
            <div className="job-title-section">
              <h1>{job.jobTitle}</h1>
              <h2>{job.companyName}</h2>
            </div>
          </div>

          {/* Informações Rápidas */}
          <div className="job-quick-info">
            {job.jobGeo && (
              <div className="info-item">
                <FiMapPin />
                <span>{job.jobGeo}</span>
              </div>
            )}
            {job.jobType && job.jobType.length > 0 && (
              <div className="info-item">
                <FiClock />
                <span>{job.jobType.join(', ')}</span>
              </div>
            )}
            {job.jobLevel && (
              <div className="info-item">
                <FiBriefcase />
                <span>{job.jobLevel}</span>
              </div>
            )}
            {job.jobIndustry && job.jobIndustry.length > 0 && (
              <div className="info-item">
                <FiDollarSign />
                <span>{job.jobIndustry.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {job.jobTags && job.jobTags.length > 0 && (
            <div className="job-tags-section">
              <h3>Tecnologias</h3>
              <div className="job-tags">
                {job.jobTags.map((tag, index) => (
                  <span key={index} className="job-tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Descrição */}
          <div className="job-description-section">
            <h3>Sobre a Vaga</h3>
            <div className="job-description">
              {job.jobExcerpt ? (
                <p>{job.jobExcerpt}</p>
              ) : (
                <p>{cleanDescription(job.jobDescription)}</p>
              )}
            </div>
          </div>

          {/* Data de Publicação */}
          {job.pubDate && (
            <div className="job-publish-date">
              <small>Publicado em: {new Date(job.pubDate).toLocaleDateString('pt-BR')}</small>
            </div>
          )}

        </div>

        {/* Footer com Ações */}
        <div className="job-modal-footer">
          <button className="submit-site-btn" onClick={handleSubmitOnSite}>
            <FiExternalLink />
            Apply on Company Site
          </button>
          <p className="modal-disclaimer">
            Redirecionamento inteligente para o site oficial da empresa
          </p>
          <div className="job-links">
            <button 
              className="jobicy-link-btn" 
              onClick={() => window.open(job.url, '_blank')}
            >
              Ver no Jobicy
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default JobDetailModal;
