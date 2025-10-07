// src/components/JobCard.jsx

import React from 'react';

// 1. Receba a nova propriedade { onCardClick } aqui
function JobCard({ title, company, tags, onCardClick }) {
  return (
    // 2. Adicione o evento onClick na div principal do card
    <div className="job-card" onClick={onCardClick}> 
      <h3>{title}</h3>
      <p>{company}</p>
      <div className="job-tags">
        {/* 3. Verificamos se 'tags' existe e é um array antes de o percorrermos */}
        {Array.isArray(tags) && tags.map((tag, index) => (
          <span key={index}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default JobCard;