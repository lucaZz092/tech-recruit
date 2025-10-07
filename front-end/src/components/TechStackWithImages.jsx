import React from 'react';
import LogoLoop from './LogoLoop/LogoLoop';

// Importe seus SVGs como imagens normais
import ReactLogo from '../assets/react-logo.svg';
import NodeLogo from '../assets/node-logo.svg';
import NextLogo from '../assets/next-logo.svg';
import TypeScriptLogo from '../assets/typescript-logo.svg';
import AWSLogo from '../assets/aws-logo.svg';
import GoogleLogo from '../assets/google-logo.svg';
import DockerLogo from '../assets/docker-logo.svg';
import KubernetesLogo from '../assets/kubernetes-logo.svg';

// Use o formato de imagem em vez de node
const techLogos = [
  { src: ReactLogo, alt: "React", title: "React" },
  { src: NodeLogo, alt: "Node.js", title: "Node.js" },
  { src: NextLogo, alt: "Next.js", title: "Next.js" },
  { src: TypeScriptLogo, alt: "TypeScript", title: "TypeScript" },
  { src: AWSLogo, alt: "AWS", title: "AWS" },
  { src: GoogleLogo, alt: "Google Cloud", title: "Google Cloud" },
  { src: DockerLogo, alt: "Docker", title: "Docker" },
  { src: KubernetesLogo, alt: "Kubernetes", title: "Kubernetes" },
];

function TechStack() {
  return (
    <section className="tech-stack-section">
      <div className="container">
        <p className="section-subtitle">Focado nas Tecnologias mais Desejadas</p>
        <div className="logo-loop-container">
          <LogoLoop 
            logos={techLogos} 
            speed={100}
            fadeOut={true}
            fadeOutColor="#121212"
            logoHeight={40}
            gap={80}
          />
        </div>
      </div>
    </section>
  );
}

export default TechStack;
