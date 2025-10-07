// src/components/FeaturedJobs.jsx

import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';

function FeaturedJobs({ onJobCardClick }) {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Voltamos a chamar a API diretamente, mas agora a da Jobicy
    const fetchJobs = async () => {
      try {
        const apiUrl = 'https://jobicy.com/api/v2/remote-jobs?count=6&tag=react';
        
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error('A resposta da rede não foi OK.');
        }
        
        const data = await response.json();

        if (!data.jobs) {
            throw new Error('A API não retornou os dados de vagas esperados.');
        }

        setJobs(data.jobs);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []); // O array vazio [] garante que isto só executa uma vez

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