# 🚀 Guia Completo de Deploy - Tech Recruit

Este guia contém instruções detalhadas para fazer deploy da aplicação Tech Recruit em diferentes ambientes.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Git configurado
- Conta nas plataformas de deploy (opcional)

## 🛠️ Opções de Deploy

### 1. 🐳 Docker (Recomendado para Produção)

**Vantagens:** Ambiente isolado, fácil escalonamento, inclui MongoDB

```bash
# 1. Clone o repositório
git clone https://github.com/lucaZz092/tech-recruit.git
cd tech-recruit

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 3. Execute com Docker Compose
docker-compose up -d

# 4. Verifique os serviços
curl http://localhost:5001/api/health
```

**URLs de Acesso:**
- Frontend: http://localhost:80
- Backend: http://localhost:5001
- MongoDB: mongodb://localhost:27017

### 2. ☁️ Deploy em Nuvem (Separado)

#### Backend (Railway/Render/Heroku)

**Railway (Recomendado):**
1. Conecte seu GitHub no [Railway](https://railway.app)
2. Selecione o repositório
3. Configure as variáveis de ambiente:
```env
NODE_ENV=production
JWT_SECRET=sua-chave-super-secreta-aqui
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tech-recruit
ALLOWED_ORIGINS=https://seu-frontend.vercel.app
```
4. Deploy automático do `back-end/`

**Heroku:**
```bash
# 1. Login no Heroku
heroku login

# 2. Crie a aplicação
heroku create seu-backend-app

# 3. Configure variáveis
heroku config:set NODE_ENV=production -a seu-backend-app
heroku config:set JWT_SECRET=$(openssl rand -base64 32) -a seu-backend-app

# 4. Deploy
git subtree push --prefix=back-end heroku main
```

#### Frontend (Vercel/Netlify)

**Vercel (Recomendado):**
1. Conecte seu GitHub no [Vercel](https://vercel.com)
2. Configurações de build:
```
Build Command: cd front-end && npm run build
Output Directory: front-end/dist
```
3. Variável de ambiente:
```
VITE_API_URL=https://seu-backend.railway.app
```

### 3. 🖥️ Deploy Local (Produção)

```bash
# Execute o script automatizado
./deploy.sh

# Ou manualmente:
# 1. Build do frontend
cd front-end && npm install && npm run build

# 2. Setup do backend
cd ../back-end && npm install --production

# 3. Configure .env
cp ../.env.example ../.env

# 4. Inicie os serviços
npm start & # Backend
npx serve ../front-end/dist -l 3000 # Frontend
```

## 🔧 Configuração de Variáveis

### Backend (.env)
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tech-recruit
JWT_SECRET=sua-chave-jwt-super-secreta-256-bits
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=https://tech-recruit-frontend.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```env
VITE_API_URL=https://tech-recruit-backend.railway.app
```

## 📊 Monitoramento

### Health Checks
```bash
# Backend
curl https://seu-backend.railway.app/api/health

# Resposta esperada:
{
  "message": "Tech Recruit API está funcionando!",
  "timestamp": "2025-10-15T20:00:00.000Z",
  "version": "1.0.0"
}
```

### Logs
```bash
# Docker
docker-compose logs -f backend
docker-compose logs -f frontend

# Railway
railway logs

# Heroku
heroku logs --tail -a seu-app
```

## 🚨 Troubleshooting

### Problemas Comuns

**1. CORS Error**
```bash
# Verifique se ALLOWED_ORIGINS está configurado corretamente
# Backend deve permitir o domínio do frontend
```

**2. Database Connection**
```bash
# Verifique se MONGODB_URI está correto
# Para MongoDB Atlas, certifique-se que o IP está na whitelist
```

**3. Build Failure**
```bash
# Limpe cache e reinstale dependências
rm -rf node_modules package-lock.json
npm install
npm run build
```

## ✅ Checklist de Produção

- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ HTTPS habilitado
- [ ] ✅ CORS configurado corretamente
- [ ] ✅ Rate limiting ativo
- [ ] ✅ Logs de erro configurados
- [ ] ✅ Health checks funcionando
- [ ] ✅ Backup do banco configurado
- [ ] ✅ Monitoramento ativo
- [ ] ✅ DNS configurado (se domínio próprio)

## 🔐 Segurança

### JWT Secret
```bash
# Gere uma chave segura
openssl rand -base64 32
```

### MongoDB
- Use MongoDB Atlas para produção
- Configure IP whitelist
- Use credenciais seguras
- Habilite encryption

### HTTPS
- Configure SSL/TLS
- Use certificados válidos
- Redirecione HTTP para HTTPS

## 📈 Otimização

### Performance
- Enable gzip compression
- Configure CDN (Cloudflare)
- Use caching strategies
- Optimize images

### Monitoring
- Setup error tracking (Sentry)
- Configure uptime monitoring
- Setup performance monitoring
- Log analysis

## 🆘 Suporte

### Comandos Úteis

```bash
# Verificar status dos serviços
docker-compose ps

# Reiniciar serviços
docker-compose restart

# Ver logs em tempo real
docker-compose logs -f

# Backup do banco
mongodump --uri="mongodb://localhost:27017/tech-recruit"

# Restore do banco
mongorestore --uri="mongodb://localhost:27017/tech-recruit" dump/
```

### Links Úteis

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Docker Documentation](https://docs.docker.com)

---

**Desenvolvido por Lucas** | [GitHub](https://github.com/lucaZz092) | [LinkedIn](https://linkedin.com/in/lucas)
