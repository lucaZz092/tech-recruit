const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, 'Título da vaga é obrigatório'],
    trim: true,
    maxlength: [100, 'Título não pode ter mais de 100 caracteres']
  },
  companyName: {
    type: String,
    required: [true, 'Nome da empresa é obrigatório'],
    trim: true
  },
  companyLogo: {
    type: String,
    default: ''
  },
  jobDescription: {
    type: String,
    required: [true, 'Descrição da vaga é obrigatória']
  },
  jobExcerpt: {
    type: String,
    maxlength: [200, 'Resumo não pode ter mais de 200 caracteres']
  },
  jobTags: [{
    type: String,
    trim: true
  }],
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
    default: 'full-time'
  },
  jobLevel: {
    type: String,
    enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'],
    required: true
  },
  jobGeo: {
    type: String,
    required: [true, 'Localização é obrigatória']
  },
  isRemote: {
    type: Boolean,
    default: true
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  requirements: [String],
  benefits: [String],
  url: {
    type: String,
    required: [true, 'URL da vaga é obrigatória']
  },
  applicationUrl: String,
  jobIndustry: String,
  companySize: String,
  pubDate: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 dias
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isExternal: {
    type: Boolean,
    default: false // true se vem de API externa
  },
  externalId: String, // ID da API externa
  source: {
    type: String,
    enum: ['internal', 'jobicy', 'remotive', 'manual'],
    default: 'internal'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  applications: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['applied', 'viewed', 'interview', 'rejected', 'accepted'],
      default: 'applied'
    },
    resume: String,
    coverLetter: String
  }],
  views: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índices para performance
JobSchema.index({ jobTags: 1 });
JobSchema.index({ jobGeo: 1 });
JobSchema.index({ jobLevel: 1 });
JobSchema.index({ companyName: 1 });
JobSchema.index({ isActive: 1, expiresAt: 1 });
JobSchema.index({ createdAt: -1 });

// Middleware para aumentar views
JobSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Middleware para aumentar clicks
JobSchema.methods.incrementClicks = function() {
  this.clicks += 1;
  return this.save();
};

module.exports = mongoose.model('Job', JobSchema);
