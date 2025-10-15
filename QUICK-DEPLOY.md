# ⚡ Deploy Rápido - Tech Recruit

## 🚀 1. Deploy Local (2 minutos)

```bash
git clone https://github.com/lucaZz092/tech-recruit.git
cd tech-recruit
./deploy.sh
# Escolha opção 4 (Local Production Build)
```

## 🐳 2. Docker (3 minutos)

```bash
git clone https://github.com/lucaZz092/tech-recruit.git
cd tech-recruit
cp .env.example .env
docker-compose up -d
```

**Acesso:** http://localhost:80

## ☁️ 3. Nuvem (5 minutos)

### Backend (Railway)
1. Fork o repositório no GitHub
2. Conecte no [Railway](https://railway.app)
3. Deploy do `back-end/`
4. Adicione variáveis:
```
NODE_ENV=production
JWT_SECRET=sua-chave-aqui
MONGODB_URI=sua-string-mongodb
```

### Frontend (Vercel)
1. Conecte no [Vercel](https://vercel.com)
2. Build: `cd front-end && npm run build`
3. Output: `front-end/dist`
4. Variável: `VITE_API_URL=https://seu-backend.railway.app`

## 🧪 Teste

```bash
# Login de teste
Email: demo@teste.com
Senha: 123456
```

## 📞 Suporte

**Problemas?** Abra uma [issue no GitHub](https://github.com/lucaZz092/tech-recruit/issues)

---

**✨ Desenvolvido por Lucas** | ⭐ [Dê uma estrela no GitHub!](https://github.com/lucaZz092/tech-recruit)
