// src/components/FeaturedJobs.jsx
import React from 'react';
import JobCard from './JobCard';

// Dados de exemplo (simulando uma chamada de API)
const jobsData = [
  {
    id: 1,
    title: 'Engenheiro(a) de Software Sênior (Backend)',
    company: 'InovaTech Solutions - Remoto (Brasil)',
    tags: ['Node.js', 'TypeScript', 'AWS', 'GraphQL']
  },
  {
    id: 2,
    title: 'Desenvolvedor(a) Frontend Pleno (React)',
    company: 'CodeLeap Inc. - Híbrido (São Paulo, SP)',
    tags: ['React', 'Next.js', 'Styled-Components']
  },
  {
    id: 3,
    title: 'Site Reliability Engineer (SRE)',
    company: 'CyberData Corp - Remoto (Global)',
    tags: ['Kubernetes', 'Terraform', 'CI/CD', 'Python']
  },
  {
    id: 4,
    title: 'Site Reliability Engineer (SRE)',
    company: 'CyberData Corp - Remoto (Global)',
    tags: ['Kubernetes', 'Terraform', 'CI/CD', 'Python']
  },
  {
    id: 5,
    title: 'Site Reliability Engineer (SRE)',
    company: 'CyberData Corp - Remoto (Global)',
    tags: ['Kubernetes', 'Terraform', 'CI/CD', 'Python']
  },
  {
    id: 6,
    title: 'Site Reliability Engineer (SRE)',
    company: 'CyberData Corp - Remoto (Global)',
    tags: ['Kubernetes', 'Terraform', 'CI/CD', 'Python']
  }
];

function FeaturedJobs({ onJobCardClick }) {
  return (
    <section id="vagas" className="featured-jobs">
      <div className="container">
        <h2 className="section-title">Vagas em Destaque</h2>
        <div className="job-list">
          {jobsData.map(job => (
            <JobCard
              key={job.id}
              title={job.title}
              company={job.company}
              tags={job.tags}
              onClick={onJobCardClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedJobs;