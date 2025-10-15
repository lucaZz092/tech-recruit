const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/applications
// @desc    Obter candidaturas do usuário
// @access  Private
router.get('/applications', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'applications.jobId',
        select: 'jobTitle companyName jobGeo jobType jobLevel createdAt',
        match: { isActive: true }
      })
      .lean();

    // Filtrar candidaturas com vagas válidas
    const validApplications = user.applications.filter(app => app.jobId);

    res.json({
      success: true,
      data: validApplications
    });
  } catch (error) {
    console.error('Erro ao buscar candidaturas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   GET /api/users/favorites
// @desc    Obter vagas favoritas do usuário
// @access  Private
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'favoriteJobs',
        match: { isActive: true },
        select: '-applications'
      })
      .lean();

    res.json({
      success: true,
      data: user.favoriteJobs
    });
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Atualizar preferências do usuário
// @access  Private
router.put('/preferences', protect, [
  body('preferences').optional().isObject(),
  body('preferences.jobTypes').optional().isArray(),
  body('preferences.technologies').optional().isArray(),
  body('preferences.locations').optional().isArray(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { preferences } },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Preferências atualizadas com sucesso',
      data: user.preferences
    });
  } catch (error) {
    console.error('Erro ao atualizar preferências:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   GET /api/users/dashboard
// @desc    Dados do dashboard do usuário
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'applications.jobId',
        select: 'jobTitle companyName createdAt',
        match: { isActive: true }
      })
      .populate({
        path: 'favoriteJobs',
        select: 'jobTitle companyName createdAt',
        match: { isActive: true },
        options: { limit: 5 }
      })
      .lean();

    // Estatísticas
    const totalApplications = user.applications.length;
    const recentApplications = user.applications
      .filter(app => app.jobId)
      .slice(-5);

    // Vagas recomendadas baseadas no perfil
    const recommendedQuery = {};
    
    if (user.preferences?.technologies?.length > 0) {
      recommendedQuery.jobTags = { 
        $in: user.preferences.technologies.map(tech => new RegExp(tech, 'i')) 
      };
    }

    const recommendedJobs = await Job.find({
      ...recommendedQuery,
      isActive: true,
      expiresAt: { $gt: new Date() },
      _id: { $nin: user.applications.map(app => app.jobId) } // Excluir vagas já aplicadas
    })
    .select('-applications')
    .limit(10)
    .sort({ createdAt: -1 })
    .lean();

    res.json({
      success: true,
      data: {
        stats: {
          totalApplications,
          totalFavorites: user.favoriteJobs.length,
          profileCompleteness: calculateProfileCompleteness(user)
        },
        recentApplications,
        favoriteJobs: user.favoriteJobs,
        recommendedJobs
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Deletar conta do usuário
// @access  Private
router.delete('/account', protect, async (req, res) => {
  try {
    // Em vez de deletar completamente, desativar conta
    await User.findByIdAndUpdate(req.user.id, { 
      isActive: false,
      email: `deleted_${Date.now()}_${req.user.email}` // Evitar conflitos
    });

    res.json({
      success: true,
      message: 'Conta desativada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// Função auxiliar para calcular completude do perfil
function calculateProfileCompleteness(user) {
  const fields = [
    'name', 'email',
    'profile.phone', 'profile.location', 'profile.bio',
    'profile.skills', 'profile.experience'
  ];

  let completed = 0;
  
  fields.forEach(field => {
    const keys = field.split('.');
    let value = user;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    if (value && (Array.isArray(value) ? value.length > 0 : true)) {
      completed++;
    }
  });

  return Math.round((completed / fields.length) * 100);
}

module.exports = router;
