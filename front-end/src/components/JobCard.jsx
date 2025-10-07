// src/components/JobCard.jsx
import React from 'react';

function JobCard({ title, company, tags, onClick }) {
  return (
    <div className="job-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{company}</p>
      <div className="job-tags">
        {tags.map((tag, index) => (
          <span key={index}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default JobCard;