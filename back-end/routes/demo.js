const express = require('express');
const router = express.Router();

// Dados mock para demonstração
const mockJobs = [
  {
    id: 1,
    jobTitle: "Senior Full Stack Developer",
    companyName: "TechCorp Innovation",
    jobDescription: "Estamos procurando um desenvolvedor full stack experiente para se juntar ao nosso time de inovação. Você trabalhará com React, Node.js e MongoDB em projetos desafiadores.",
    jobExcerpt: "Oportunidade para desenvolvedor full stack sênior em empresa inovadora",
    jobTags: ["React", "Node.js", "MongoDB", "TypeScript"],
    jobType: "full-time",
    jobLevel: "senior",
    jobGeo: "São Paulo, SP (Híbrido)",
    isRemote: false,
    url: "https://techcorp.com/careers/fullstack-senior",
    companyLogo: "https://via.placeholder.com/100x100?text=TC",
    salary: { min: 8000, max: 15000, currency: "BRL" },
    isActive: true,
    source: "internal",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    jobTitle: "React Frontend Developer",
    companyName: "StartupXYZ",
    jobDescription: "Procuramos um desenvolvedor React para criar interfaces incríveis. Você trabalhará com as mais modernas tecnologias frontend.",
    jobExcerpt: "Vaga para desenvolvedor React em startup em crescimento",
    jobTags: ["React", "JavaScript", "CSS", "Git"],
    jobType: "full-time",
    jobLevel: "mid",
    jobGeo: "Remote",
    isRemote: true,
    url: "https://startupxyz.com/jobs/react-dev",
    companyLogo: "https://via.placeholder.com/100x100?text=XYZ",
    isActive: true,
    source: "internal",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    jobTitle: "Python Backend Engineer",
    companyName: "DataFlow Solutions",
    jobDescription: "Desenvolva APIs robustas e sistemas escaláveis usando Python e Django. Trabalhe com grandes volumes de dados.",
    jobExcerpt: "Backend engineer Python para trabalhar com big data",
    jobTags: ["Python", "Django", "PostgreSQL", "AWS"],
    jobType: "full-time",
    jobLevel: "mid",
    jobGeo: "Rio de Janeiro, RJ",
    isRemote: false,
    url: "https://dataflow.com/careers/python-backend",
    companyLogo: "https://via.placeholder.com/100x100?text=DF",
    isActive: true,
    source: "internal",
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    jobTitle: "DevOps Engineer",
    companyName: "CloudPioneers",
    jobDescription: "Gerencie infraestrutura na nuvem e automatize processos de deploy. Experiência com Kubernetes e Docker necessária.",
    jobExcerpt: "DevOps engineer para infraestrutura cloud moderna",
    jobTags: ["DevOps", "Kubernetes", "Docker", "AWS", "CI/CD"],
    jobType: "full-time",
    jobLevel: "senior",
    jobGeo: "Remote",
    isRemote: true,
    url: "https://cloudpioneers.com/jobs/devops",
    companyLogo: "https://via.placeholder.com/100x100?text=CP",
    isActive: true,
    source: "internal",
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    jobTitle: "Vue.js Frontend Developer",
    companyName: "ModernWeb Co",
    jobDescription: "Criar aplicações web modernas com Vue.js 3 e Composition API. Trabalho em equipe ágil e ambiente colaborativo.",
    jobExcerpt: "Desenvolvedor Vue.js para projetos web modernos",
    jobTags: ["Vue.js", "JavaScript", "Vuex", "Nuxt"],
    jobType: "full-time",
    jobLevel: "junior",
    jobGeo: "Belo Horizonte, MG",
    isRemote: false,
    url: "https://modernweb.com/careers/vue-dev",
    companyLogo: "https://via.placeholder.com/100x100?text=MW",
    isActive: true,
    source: "internal",
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    jobTitle: "Machine Learning Engineer",
    companyName: "AI Innovations",
    jobDescription: "Desenvolva modelos de machine learning e sistemas de IA. Trabalhe com Python, TensorFlow e dados em escala.",
    jobExcerpt: "ML engineer para projetos de inteligência artificial",
    jobTags: ["Python", "TensorFlow", "Machine Learning", "Data Science"],
    jobType: "full-time",
    jobLevel: "senior",
    jobGeo: "São Paulo, SP",
    isRemote: true,
    url: "https://aiinnovations.com/jobs/ml-engineer",
    companyLogo: "https://via.placeholder.com/100x100?text=AI",
    isActive: true,
    source: "internal",
    createdAt: new Date().toISOString()
  }
];

// @route   GET /api/demo/jobs
// @desc    Obter vagas de demonstração
// @access  Public
router.get('/jobs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const technology = req.query.technology;
    const location = req.query.location;
    const level = req.query.level;

    let filteredJobs = [...mockJobs];

    // Aplicar filtros
    if (search) {
      filteredJobs = filteredJobs.filter(job => 
        job.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        job.companyName.toLowerCase().includes(search.toLowerCase()) ||
        job.jobDescription.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (technology) {
      filteredJobs = filteredJobs.filter(job =>
        job.jobTags.some(tag => 
          tag.toLowerCase().includes(technology.toLowerCase())
        )
      );
    }

    if (location) {
      if (location === 'remote') {
        filteredJobs = filteredJobs.filter(job => job.isRemote);
      } else {
        filteredJobs = filteredJobs.filter(job =>
          job.jobGeo.toLowerCase().includes(location.toLowerCase())
        );
      }
    }

    if (level) {
      filteredJobs = filteredJobs.filter(job => job.jobLevel === level);
    }

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedJobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredJobs.length / limit),
        totalJobs: filteredJobs.length,
        hasNextPage: endIndex < filteredJobs.length,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Erro ao buscar vagas demo:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   GET /api/demo/jobs/random
// @desc    Obter vagas aleatórias
// @access  Public
router.get('/jobs/random', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 6;
    
    // Embaralhar e pegar quantidade solicitada
    const shuffledJobs = [...mockJobs]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    const featuredTechs = ['React', 'Python', 'Vue.js', 'DevOps', 'Machine Learning', 'Node.js'];

    res.json({
      success: true,
      data: shuffledJobs,
      count: shuffledJobs.length,
      featuredTechs: featuredTechs.slice(0, 6)
    });
  } catch (error) {
    console.error('Erro ao buscar vagas aleatórias demo:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   GET /api/demo/jobs/:id
// @desc    Obter vaga específica
// @access  Public
router.get('/jobs/:id', async (req, res) => {
  try {
    const job = mockJobs.find(j => j.id == req.params.id);

    if (!job) {
      return res.status(404).json({ 
        error: 'Vaga não encontrada' 
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Erro ao buscar vaga demo:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;
