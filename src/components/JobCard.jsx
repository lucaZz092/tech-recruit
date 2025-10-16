// src/components/JobCard.jsx
import React from 'react';

// 1. Recebe a propriedade 'onCardClick'
function JobCard({ title, company, tags, onCardClick }) {
  return (
    // 2. Usa a propriedade no evento onClick da div principal
    <div className="job-card" onClick={onCardClick}> 
      <h3>{title}</h3>
      <p>{company}</p>
      <div className="job-tags">
        {Array.isArray(tags) && tags.map((tag, index) => (
          <span key={index}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default JobCard;