# 🚀 Tech Recruit - Plataforma Completa de Vagas Tech

Uma plataforma moderna e completa para conectar desenvolvedores às melhores oportunidades em tecnologia.

## ✨ Funcionalidades Implementadas

### 🔐 **Sistema de Autenticação**
- ✅ Login e registro de usuários
- ✅ Autenticação com JWT (mock)
- ✅ Proteção de rotas
- ✅ Gerenciamento de estado com Context API
- ✅ Persistência via localStorage

### 💼 **Sistema de Vagas**
- ✅ Dashboard com vagas reais via API
- ✅ Filtros avançados (tecnologia, localização, nível)
- ✅ Sistema "Ver Mais" com paginação
- ✅ Modal de detalhes com informações completas
- ✅ Redirecionamento inteligente para empresas
- ✅ Vagas aleatórias para descoberta

### 🎨 **Interface e UX**
- ✅ Design responsivo e moderno
- ✅ Tema escuro com gradientes
- ✅ Animações suaves e loading states
- ✅ Header dinâmico (logado/deslogado)
- ✅ Página 404 customizada
- ✅ Componentes reutilizáveis

## 🛠️ Stack Tecnológica

### **Frontend**
- **React 19.1.1** - Library para UI
- **Vite 7.1.14** - Build tool e dev server
- **React Router 7.9.3** - Navegação SPA
- **CSS3** - Estilização com custom properties
- **Context API** - Gerenciamento de estado

### **Backend**
- **Node.js 22.16.0** - Runtime JavaScript
- **Express 4.18.2** - Framework web
- **MongoDB/Mongoose** - Banco de dados (preparado)
- **JWT** - Autenticação
- **Helmet** - Segurança
- **CORS** - Cross-origin requests
- **Rate Limiting** - Proteção contra spam

## 🎨 Design

- **Tema escuro** com cores modernas
- **Gradientes** em verde tech (#3DDC84)
- **Animações suaves** e transições
- **Layout responsivo** e acessível

## 🚀 Como executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Frontend
\`\`\`bash
cd front-end
npm install
npm run dev
\`\`\`

### Backend
\`\`\`bash
cd back-end
npm install
node buscarVagas.js
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
tech-recruit/
├── front-end/          # Aplicação React
│   ├── src/
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── App.jsx     # Componente principal
│   │   └── App.css     # Estilos globais
│   └── package.json
├── back-end/           # API Node.js
│   ├── buscarVagas.js  # Script de busca de vagas
│   └── package.json
└── README.md
\`\`\`

## 🌐 Deploy

- **Frontend**: Vercel/Netlify (recomendado)
- **Backend**: Railway/Render

## � Como Executar

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- MongoDB (opcional - há dados mock)

### **1. Clone o repositório**
```bash
git clone https://github.com/lucaZz092/tech-recruit.git
cd tech-recruit
```

### **2. Backend**
```bash
cd back-end
npm install
node server.js
```
🌐 API rodando em: http://localhost:5001

### **3. Frontend** 
```bash
cd front-end
npm install
npm run dev
```
🖥️ App rodando em: http://localhost:5173

## 🧪 Credenciais de Teste

```
Email: demo@teste.com
Senha: 123456
```

## 📊 Endpoints da API

### **Autenticação**
- `POST /api/demo/auth/login` - Login
- `POST /api/demo/auth/register` - Registro

### **Vagas**
- `GET /api/demo/jobs` - Listar vagas com filtros
- `GET /api/demo/jobs/random` - Vagas aleatórias
- `GET /api/demo/jobs/:id` - Detalhes da vaga

### **Utilitários**
- `GET /api/health` - Health check

## 🏗️ Estrutura do Projeto

```
tech-recruit/
├── back-end/                 # API Node.js + Express
│   ├── routes/              # Rotas organizadas
│   ├── models/              # Modelos MongoDB
│   ├── middleware/          # Auth, validação
│   └── server.js            # Servidor principal
│
├── front-end/               # App React + Vite  
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── contexts/        # Context API
│   │   ├── services/        # API service
│   │   └── pages/           # Páginas/rotas
│   └── public/              # Assets estáticos
│
└── README.md               # Documentação
```

## � Deploy para Produção

### **Opção 1: Docker (Recomendado)**
```bash
# Clone e configure
git clone https://github.com/lucaZz092/tech-recruit.git
cd tech-recruit

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute com Docker
docker-compose up -d
```
✅ **URLs**: Frontend (http://localhost:80), Backend (http://localhost:5001)

### **Opção 2: Plataformas de Cloud**

#### **Backend (Railway/Render/Heroku)**
1. Conecte seu repositório
2. Configure as variáveis de ambiente:
   ```
   NODE_ENV=production
   JWT_SECRET=sua-chave-super-secreta
   MONGODB_URI=sua-string-mongodb-atlas
   ALLOWED_ORIGINS=https://seu-frontend.com
   ```
3. Deploy automático do diretório `back-end/`

#### **Frontend (Vercel/Netlify)**
1. Conecte seu repositório
2. Configurações de build:
   ```
   Build Command: cd front-end && npm run build
   Output Directory: front-end/dist
   ```
3. Variável de ambiente:
   ```
   VITE_API_URL=https://sua-api-backend.com
   ```

### **Opção 3: Script Automatizado**
```bash
# Execute o script de deploy
./deploy.sh
```
Escolha entre: Docker, Heroku, Vercel ou Build Local

### **Configurações de Produção**

#### **Banco de Dados**
- **MongoDB Atlas** (recomendado)
- **Railway PostgreSQL** (alternativa)
- **Docker MongoDB** (desenvolvimento)

#### **Variáveis de Ambiente**
```bash
# Backend (.env)
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tech-recruit
JWT_SECRET=sua-chave-jwt-super-secreta-256-bits
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=https://tech-recruit-frontend.vercel.app

# Frontend (.env)
VITE_API_URL=https://tech-recruit-backend.railway.app
```

#### **Checklist de Produção**
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Banco de dados configurado
- [ ] ✅ CORS configurado corretamente
- [ ] ✅ HTTPS habilitado
- [ ] ✅ Rate limiting ativo
- [ ] ✅ Logs de erro configurados
- [ ] ✅ Health checks funcionando
- [ ] ✅ Backup do banco configurado

## �🔮 Próximas Funcionalidades

### **Para Produção**
- [ ] MongoDB Atlas connection ✅
- [ ] JWT real com refresh tokens  
- [ ] Upload de imagens/arquivos
- [ ] Sistema de candidaturas completo
- [ ] Dashboard para empresas
- [ ] Notificações por email
- [ ] Métricas e analytics
- [ ] Cache com Redis
- [ ] Deploy automatizado ✅

### **Melhorias UX/UI**
- [ ] PWA (Progressive Web App)
- [ ] Dark/Light theme toggle
- [ ] Busca com autocomplete
- [ ] Favoritos e histórico
- [ ] Perfil de usuário completo
- [ ] Chat/mensagens
- [ ] Mobile app (React Native)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: amazing feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👨‍💻 Autor

**Lucas** - [GitHub](https://github.com/lucaZz092)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

⭐ **Se este projeto te ajudou, deixe uma estrela!**

🐛 **Encontrou um bug?** Abra uma [issue](https://github.com/lucaZz092/tech-recruit/issues)

💡 **Tem uma ideia?** Compartilhe nas [discussions](https://github.com/lucaZz092/tech-recruit/discussions)
