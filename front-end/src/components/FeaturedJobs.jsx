// src/components/FeaturedJobs.jsx

import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';

function FeaturedJobs({ onJobCardClick }) { // <- Recebemos a função do App.js
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobsFromOurProxy = async () => {
      try {
        const response = await fetch('/api/fetchJobs');
        const data = await response.json();

        if (response.status !== 200 || !data.jobs) {
          throw new Error(data.error || 'Não foi possível carregar as vagas.');
        }

        setJobs(data.jobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobsFromOurProxy();
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
            // Mapeamento dos dados da API para as props do JobCard
            title={job.jobTitle}
            company={job.companyName}
            tags={job.jobTags} // <- Passando as stacks/tags
            
            // Passando a função de clique para o JobCard
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