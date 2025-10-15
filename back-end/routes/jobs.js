const express = require('express');
const axios = require('axios');
const { body, validationResult, query } = require('express-validator');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Obter vagas com filtros
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser um número positivo'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limite deve ser entre 1 e 50'),
  query('search').optional().isString(),
  query('technology').optional().isString(),
  query('location').optional().isString(),
  query('level').optional().isString(),
  query('type').optional().isString(),
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Parâmetros inválidos',
        details: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Construir filtros
    const filters = { 
      isActive: true,
      expiresAt: { $gt: new Date() }
    };

    if (req.query.search) {
      filters.$or = [
        { jobTitle: { $regex: req.query.search, $options: 'i' } },
        { companyName: { $regex: req.query.search, $options: 'i' } },
        { jobDescription: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.technology) {
      filters.jobTags = { $in: [new RegExp(req.query.technology, 'i')] };
    }

    if (req.query.location) {
      if (req.query.location === 'remote') {
        filters.isRemote = true;
      } else {
        filters.jobGeo = { $regex: req.query.location, $options: 'i' };
      }
    }

    if (req.query.level) {
      filters.jobLevel = req.query.level;
    }

    if (req.query.type) {
      filters.jobType = req.query.type;
    }

    // Buscar vagas
    const jobs = await Job.find(filters)
      .select('-applications') // Não retornar aplicações por performance
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Job.countDocuments(filters);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalJobs: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   GET /api/jobs/random
// @desc    Obter vagas aleatórias de diferentes tecnologias
// @access  Public
router.get('/random', optionalAuth, async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 25;
    
    // Primeiro, tentar buscar de APIs externas
    const technologies = ['javascript', 'python', 'react', 'node', 'java', 'typescript'];
    const randomTechs = technologies.sort(() => Math.random() - 0.5).slice(0, 6);
    
    let allJobs = [];

    // Buscar da API Jobicy
    for (const tech of randomTechs) {
      try {
        const params = new URLSearchParams({
          count: '5',
          tag: tech
        });

        const response = await axios.get(`${process.env.JOBICY_API_URL}?${params.toString()}`, {
          timeout: 5000
        });

        if (response.data.jobs && response.data.jobs.length > 0) {
          const techJobs = response.data.jobs.map(job => ({
            ...job,
            source: 'jobicy',
            sourceTech: tech,
            isExternal: true
          }));
          allJobs.push(...techJobs);
        }
      } catch (error) {
        console.warn(`Erro ao buscar ${tech} da API externa:`, error.message);
      }
    }

    // Se não conseguiu vagas suficientes, buscar do banco local
    if (allJobs.length < count) {
      const localJobs = await Job.find({ 
        isActive: true,
        expiresAt: { $gt: new Date() }
      })
      .limit(count - allJobs.length)
      .sort({ createdAt: -1 })
      .lean();

      allJobs.push(...localJobs);
    }

    // Embaralhar e limitar
    const shuffledJobs = allJobs
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    res.json({
      success: true,
      data: shuffledJobs,
      count: shuffledJobs.length,
      featuredTechs: randomTechs
    });
  } catch (error) {
    console.error('Erro ao buscar vagas aleatórias:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   GET /api/jobs/:id
// @desc    Obter vaga específica
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email')
      .lean();

    if (!job) {
      return res.status(404).json({ 
        error: 'Vaga não encontrada' 
      });
    }

    // Incrementar visualizações
    await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Erro ao buscar vaga:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   POST /api/jobs
// @desc    Criar nova vaga
// @access  Private (Empresa ou Admin)
router.post('/', protect, authorize('company', 'admin'), [
  body('jobTitle').trim().notEmpty().withMessage('Título da vaga é obrigatório'),
  body('companyName').trim().notEmpty().withMessage('Nome da empresa é obrigatório'),
  body('jobDescription').trim().notEmpty().withMessage('Descrição da vaga é obrigatória'),
  body('jobLevel').isIn(['entry', 'junior', 'mid', 'senior', 'lead', 'executive']).withMessage('Nível inválido'),
  body('jobGeo').trim().notEmpty().withMessage('Localização é obrigatória'),
  body('url').isURL().withMessage('URL inválida'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const jobData = {
      ...req.body,
      postedBy: req.user.id,
      source: 'internal',
      isExternal: false
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: 'Vaga criada com sucesso',
      data: job
    });
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Candidatar-se a uma vaga
// @access  Private
router.post('/:id/apply', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ 
        error: 'Vaga não encontrada' 
      });
    }

    // Verificar se já se candidatou
    const existingApplication = job.applications.find(
      app => app.userId.toString() === req.user.id
    );

    if (existingApplication) {
      return res.status(400).json({ 
        error: 'Você já se candidatou a esta vaga' 
      });
    }

    // Adicionar candidatura
    job.applications.push({
      userId: req.user.id,
      appliedAt: new Date(),
      status: 'applied'
    });

    await job.save();

    // Adicionar ao histórico do usuário
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        applications: {
          jobId: job._id,
          appliedAt: new Date(),
          status: 'applied'
        }
      }
    });

    res.json({
      success: true,
      message: 'Candidatura enviada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao candidatar-se:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   POST /api/jobs/:id/favorite
// @desc    Favoritar/desfavoritar vaga
// @access  Private
router.post('/:id/favorite', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const jobId = req.params.id;

    const isFavorited = user.favoriteJobs.includes(jobId);

    if (isFavorited) {
      // Remover dos favoritos
      user.favoriteJobs = user.favoriteJobs.filter(
        id => id.toString() !== jobId
      );
    } else {
      // Adicionar aos favoritos
      user.favoriteJobs.push(jobId);
    }

    await user.save();

    res.json({
      success: true,
      message: isFavorited ? 'Vaga removida dos favoritos' : 'Vaga adicionada aos favoritos',
      isFavorited: !isFavorited
    });
  } catch (error) {
    console.error('Erro ao favoritar vaga:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;
