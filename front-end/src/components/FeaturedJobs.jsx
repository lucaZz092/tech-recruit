// src/components/FeaturedJobs.jsx

import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';

function FeaturedJobs({ onJobCardClick }) {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Dados de fallback caso a API falhe
    const fallbackJobs = [
      { id: 1, jobTitle: "Desenvolvedor React Sênior", companyName: "TechCorp", jobTags: ["React", "TypeScript", "Node.js"] },
      { id: 2, jobTitle: "Full Stack Developer", companyName: "StartupXYZ", jobTags: ["JavaScript", "Python", "AWS"] },
      { id: 3, jobTitle: "Frontend Engineer", companyName: "InnovaTech", jobTags: ["Vue.js", "React", "CSS"] }
    ];

    const fetchJobs = async () => {
      try {
        console.log('Buscando vagas da API Jobicy...');
        
        // ✨ CONFIGURAÇÕES PREDEFINIDAS PARA DIFERENTES PERFIS ✨
        
        // 🚀 Configuração atual - React/Frontend
        const filters = {
          count: 6,
          tag: 'react',
          geo: '',
          industry: '',
          level: ''
        };
        
        // 💡 EXEMPLOS DE OUTRAS CONFIGURAÇÕES:
        
        // Para vagas de Python/Backend:
        // const filters = { count: 6, tag: 'python', geo: 'usa', level: 'senior' };
        
        // Para vagas Júnior em JavaScript:
        // const filters = { count: 8, tag: 'javascript', level: 'junior' };
        
        // Para vagas de DevOps remotas:
        // const filters = { count: 5, tag: 'docker', geo: 'remote' };
        
        // Para vagas em startups (múltiplas tecnologias):
        // const filters = { count: 10, industry: 'software-engineering' };
        
        // Construindo URL com filtros
        const params = new URLSearchParams();
        if (filters.count) params.append('count', filters.count);
        if (filters.tag) params.append('tag', filters.tag);
        if (filters.geo) params.append('geo', filters.geo);
        if (filters.industry) params.append('industry', filters.industry);
        if (filters.level) params.append('level', filters.level);
        
        const apiUrl = `https://jobicy.com/api/v2/remote-jobs?${params.toString()}`;
        
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Dados recebidos da API:', data);

        if (!data.jobs || data.jobs.length === 0) {
          throw new Error('Nenhuma vaga encontrada na API');
        }

        setJobs(data.jobs);

      } catch (err) {
        console.error('Erro ao buscar vagas da API:', err);
        console.log('Usando dados de fallback...');
        setJobs(fallbackJobs);
        setError(`API indisponível - Exibindo vagas exemplo (${err.message})`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const renderContent = () => {
    if (isLoading) return <p style={{ textAlign: 'center' }}>A carregar vagas...</p>;
    if (error) return <p style={{ textAlign: 'center', color: '#ff6b6b' }}>Erro: {error}</p>;
    if (jobs.length === 0) return <p style={{ textAlign: 'center' }}>Nenhuma vaga encontrada no momento.</p>;

    return (
      <div className="job-list">
        {jobs.map(job => (
          <JobCard
            key={job.id}
            title={job.jobTitle}
            company={job.companyName}
            tags={job.jobTags || []}
            onCardClick={onJobCardClick}
          />
        ))}
      </div>
    );
  };

  return (
    <section id="vagas" className="featured-jobs">
      <div className="container">
        <h2 className="section-title">Vagas em Destaque</h2>
        {renderContent()}
      </div>
    </section>
  );
}

export default FeaturedJobs;