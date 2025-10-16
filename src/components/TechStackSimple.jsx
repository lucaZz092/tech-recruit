import React from 'react';
import { SiReact, SiNodedotjs } from 'react-icons/si';

function TechStackSimple() {
  return (
    <section style={{ padding: '40px 0', textAlign: 'center' }}>
      <h3>Tech Stack (Test)</h3>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <SiReact style={{ fontSize: '40px', color: '#888' }} />
        <SiNodedotjs style={{ fontSize: '40px', color: '#888' }} />
      </div>
    </section>
  );
}

export default TechStackSimple;
