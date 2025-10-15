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

// @route   POST /api/demo/auth/login
// @desc    Login de demonstração
// @access  Public
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Usuários de demonstração
    const demoUsers = [
      {
        id: 1,
        name: 'João Developer',
        email: 'demo@teste.com',
        password: '123456',
        role: 'user'
      },
      {
        id: 2,
        name: 'Maria Tech',
        email: 'maria@teste.com',
        password: '123456',
        role: 'user'
      },
      {
        id: 3,
        name: 'TechCorp Admin',
        email: 'admin@techcorp.com',
        password: '123456',
        role: 'company'
      }
    ];

    const user = demoUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos'
      });
    }

    // Token mock (em produção seria um JWT real)
    const token = `demo_token_${user.id}_${Date.now()}`;

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro no login demo:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   POST /api/demo/auth/register
// @desc    Registro de demonstração
// @access  Public
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nome, email e senha são obrigatórios'
      });
    }

    // Verificar se email já existe (simulado)
    if (email === 'demo@teste.com') {
      return res.status(400).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }

    // Criar usuário demo
    const newUser = {
      id: Math.floor(Math.random() * 10000),
      name,
      email,
      role: 'user'
    };

    // Token mock
    const token = `demo_token_${newUser.id}_${Date.now()}`;

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Erro no registro demo:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;
