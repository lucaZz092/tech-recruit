const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/companies/jobs
// @desc    Obter vagas da empresa
// @access  Private (Company/Admin)
router.get('/jobs', protect, authorize('company', 'admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find({ postedBy: req.user.id })
      .populate('applications.userId', 'name email profile.phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Job.countDocuments({ postedBy: req.user.id });

    // Calcular estatísticas
    const stats = await Job.aggregate([
      { $match: { postedBy: req.user._id } },
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          activeJobs: { 
            $sum: { 
              $cond: [{ $eq: ['$isActive', true] }, 1, 0] 
            }
          },
          totalViews: { $sum: '$views' },
          totalApplications: { 
            $sum: { $size: '$applications' }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: jobs,
      stats: stats[0] || {
        totalJobs: 0,
        activeJobs: 0,
        totalViews: 0,
        totalApplications: 0
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalJobs: total
      }
    });
  } catch (error) {
    console.error('Erro ao buscar vagas da empresa:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   GET /api/companies/applications
// @desc    Obter candidaturas das vagas da empresa
// @access  Private (Company/Admin)
router.get('/applications', protect, authorize('company', 'admin'), async (req, res) => {
  try {
    const status = req.query.status;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const matchConditions = { postedBy: req.user._id };
    
    const pipeline = [
      { $match: matchConditions },
      { $unwind: '$applications' },
      {
        $lookup: {
          from: 'users',
          localField: 'applications.userId',
          foreignField: '_id',
          as: 'applicant'
        }
      },
      { $unwind: '$applicant' },
      {
        $project: {
          jobTitle: 1,
          companyName: 1,
          'applications.appliedAt': 1,
          'applications.status': 1,
          'applications.resume': 1,
          'applications.coverLetter': 1,
          'applicant.name': 1,
          'applicant.email': 1,
          'applicant.profile': 1
        }
      }
    ];

    if (status) {
      pipeline.push({ $match: { 'applications.status': status } });
    }

    pipeline.push(
      { $sort: { 'applications.appliedAt': -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    const applications = await Job.aggregate(pipeline);
    
    // Contar total
    const countPipeline = [...pipeline.slice(0, -2)];
    const totalCount = await Job.aggregate([
      ...countPipeline,
      { $count: 'total' }
    ]);

    const total = totalCount[0]?.total || 0;

    res.json({
      success: true,
      data: applications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalApplications: total
      }
    });
  } catch (error) {
    console.error('Erro ao buscar candidaturas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   PUT /api/companies/jobs/:jobId
// @desc    Atualizar vaga da empresa
// @access  Private (Company/Admin)
router.put('/jobs/:jobId', protect, authorize('company', 'admin'), [
  body('jobTitle').optional().trim().notEmpty().withMessage('Título não pode estar vazio'),
  body('jobDescription').optional().trim().notEmpty().withMessage('Descrição não pode estar vazia'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const job = await Job.findOne({ 
      _id: req.params.jobId, 
      postedBy: req.user.id 
    });

    if (!job) {
      return res.status(404).json({ 
        error: 'Vaga não encontrada ou sem permissão' 
      });
    }

    const updateData = req.body;
    delete updateData.postedBy; // Não permitir alterar quem postou

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.jobId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Vaga atualizada com sucesso',
      data: updatedJob
    });
  } catch (error) {
    console.error('Erro ao atualizar vaga:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   DELETE /api/companies/jobs/:jobId
// @desc    Deletar/desativar vaga da empresa
// @access  Private (Company/Admin)
router.delete('/jobs/:jobId', protect, authorize('company', 'admin'), async (req, res) => {
  try {
    const job = await Job.findOne({ 
      _id: req.params.jobId, 
      postedBy: req.user.id 
    });

    if (!job) {
      return res.status(404).json({ 
        error: 'Vaga não encontrada ou sem permissão' 
      });
    }

    // Desativar em vez de deletar (manter histórico)
    job.isActive = false;
    await job.save();

    res.json({
      success: true,
      message: 'Vaga desativada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao desativar vaga:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   PUT /api/companies/applications/:jobId/:userId/status
// @desc    Atualizar status da candidatura
// @access  Private (Company/Admin)
router.put('/applications/:jobId/:userId/status', protect, authorize('company', 'admin'), [
  body('status').isIn(['applied', 'viewed', 'interview', 'rejected', 'accepted']).withMessage('Status inválido'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Status inválido',
        details: errors.array()
      });
    }

    const { jobId, userId } = req.params;
    const { status } = req.body;

    const job = await Job.findOne({ 
      _id: jobId, 
      postedBy: req.user.id 
    });

    if (!job) {
      return res.status(404).json({ 
        error: 'Vaga não encontrada ou sem permissão' 
      });
    }

    // Atualizar status na vaga
    const application = job.applications.find(
      app => app.userId.toString() === userId
    );

    if (!application) {
      return res.status(404).json({ 
        error: 'Candidatura não encontrada' 
      });
    }

    application.status = status;
    await job.save();

    // Atualizar status no usuário também
    await User.updateOne(
      { 
        _id: userId,
        'applications.jobId': jobId
      },
      {
        $set: { 'applications.$.status': status }
      }
    );

    res.json({
      success: true,
      message: `Status atualizado para "${status}"`
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// @route   GET /api/companies/dashboard
// @desc    Dashboard da empresa com estatísticas
// @access  Private (Company/Admin)
router.get('/dashboard', protect, authorize('company', 'admin'), async (req, res) => {
  try {
    // Estatísticas gerais
    const stats = await Job.aggregate([
      { $match: { postedBy: req.user._id } },
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          activeJobs: { 
            $sum: { 
              $cond: [{ $eq: ['$isActive', true] }, 1, 0] 
            }
          },
          totalViews: { $sum: '$views' },
          totalClicks: { $sum: '$clicks' },
          totalApplications: { 
            $sum: { $size: '$applications' }
          }
        }
      }
    ]);

    // Vagas mais visualizadas
    const topJobs = await Job.find({ postedBy: req.user.id })
      .select('jobTitle views clicks applications')
      .sort({ views: -1 })
      .limit(5)
      .lean();

    // Candidaturas recentes
    const recentApplications = await Job.aggregate([
      { $match: { postedBy: req.user._id } },
      { $unwind: '$applications' },
      {
        $lookup: {
          from: 'users',
          localField: 'applications.userId',
          foreignField: '_id',
          as: 'applicant'
        }
      },
      { $unwind: '$applicant' },
      {
        $project: {
          jobTitle: 1,
          'applications.appliedAt': 1,
          'applications.status': 1,
          'applicant.name': 1,
          'applicant.email': 1
        }
      },
      { $sort: { 'applications.appliedAt': -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        stats: stats[0] || {
          totalJobs: 0,
          activeJobs: 0,
          totalViews: 0,
          totalClicks: 0,
          totalApplications: 0
        },
        topJobs,
        recentApplications
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dashboard da empresa:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;
