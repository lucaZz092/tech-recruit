const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure trust proxy for production (Render, Heroku, etc)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Middleware de segurança
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
  trustProxy: process.env.NODE_ENV === 'production'
});
app.use('/api/', limiter);

// CORS configurado para o frontend (temporariamente permissivo)
app.use(cors({
  origin: true, // Permite qualquer origem temporariamente
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    // Para desenvolvimento local, usaremos MongoDB local ou MongoDB Atlas
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tech-recruit';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB conectado com sucesso!');
  } catch (error) {
    console.warn('⚠️  MongoDB não disponível:', error.message);
    console.log('🔄 Executando em modo de desenvolvimento sem banco');
    // Não sair do processo - continuar sem MongoDB para desenvolvimento
  }
};

// Conectar ao banco
connectDB();

// Rotas
app.use('/api/demo', require('./routes/demo')); // Rotas de demonstração sem banco
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Tech Recruit API está funcionando!', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err.stack);
  res.status(500).json({ 
    error: 'Algo deu errado!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
