import React from 'react';
import LogoLoop from './LogoLoop/LogoLoop';
import { SiReact, SiNodedotjs, SiNextdotjs, SiTypescript, SiAmazonwebservices, SiGooglecloud, SiDocker, SiKubernetes } from 'react-icons/si';

// Defina os logos que você quer exibir
const techLogos = [
  { node: <SiReact />, title: "React" },
  { node: <SiNodedotjs />, title: "Node.js" },
  { node: <SiNextdotjs />, title: "Next.js" },
  { node: <SiTypescript />, title: "TypeScript" },
  { node: <SiAmazonwebservices />, title: "AWS" },
  { node: <SiGooglecloud />, title: "Google Cloud" },
  { node: <SiDocker />, title: "Docker" },
  { node: <SiKubernetes />, title: "Kubernetes" },
];

function TechStack() {
  return (
    <section className="tech-stack-section">
      <div className="container">
        <p className="section-subtitle">Focado nas Tecnologias mais Desejadas</p>
        <div className="logo-loop-container">
          <LogoLoop 
            logos={techLogos} 
            speed={80}
            fadeOut={true}
            fadeOutColor="#121212"
            logoHeight={45}
            gap={70}
          />
        </div>
      </div>
    </section>
  );
}

export default TechStack;