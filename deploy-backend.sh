#!/bin/bash

# Script para deploy automático do backend
echo "🚀 Deploy do Backend - Tech Recruit"
echo "===================================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Opções de deploy para o backend:${NC}"
echo "1. Railway (Recomendado - Gratuito)"
echo "2. Render (Alternativa)"
echo "3. Instruções manuais"
echo "4. Testar backend local"
echo ""

read -p "Escolha uma opção (1-4): " choice

case $choice in
    1)
        echo -e "${YELLOW}=== RAILWAY DEPLOY ===${NC}"
        echo "1. Acesse: https://railway.app"
        echo "2. Login com GitHub"
        echo "3. Clique em 'New Project'"
        echo "4. Selecione 'Deploy from GitHub repo'"
        echo "5. Escolha: tech-recruit"
        echo "6. Railway detectará automaticamente o backend"
        echo ""
        echo -e "${GREEN}Variáveis de ambiente para configurar:${NC}"
        echo "NODE_ENV=production"
        echo "JWT_SECRET=$(openssl rand -base64 32)"
        echo "MONGODB_URI=mongodb://localhost:27017/tech-recruit"
        echo "ALLOWED_ORIGINS=https://seu-frontend.vercel.app"
        echo ""
        echo -e "${BLUE}Após o deploy, sua API estará em:${NC}"
        echo "https://tech-recruit-production-xxxx.up.railway.app"
        ;;
    2)
        echo -e "${YELLOW}=== RENDER DEPLOY ===${NC}"
        echo "1. Acesse: https://render.com"
        echo "2. Login com GitHub"
        echo "3. Clique em 'New Web Service'"
        echo "4. Conecte o repositório: tech-recruit"
        echo ""
        echo -e "${GREEN}Configurações:${NC}"
        echo "Root Directory: back-end"
        echo "Build Command: npm install"
        echo "Start Command: npm start"
        echo ""
        echo -e "${GREEN}Variáveis de ambiente:${NC}"
        echo "NODE_ENV=production"
        echo "JWT_SECRET=$(openssl rand -base64 32)"
        echo "MONGODB_URI=mongodb://localhost:27017/tech-recruit"
        ;;
    3)
        echo -e "${YELLOW}=== INSTRUÇÕES MANUAIS ===${NC}"
        echo "Para qualquer plataforma, use essas configurações:"
        echo ""
        echo -e "${GREEN}Arquivos importantes:${NC}"
        echo "- Procfile (Heroku)"
        echo "- railway.json (Railway)"
        echo "- package.json com script 'start'"
        echo ""
        echo -e "${GREEN}Variáveis obrigatórias:${NC}"
        echo "NODE_ENV=production"
        echo "PORT=5001"
        echo "JWT_SECRET=sua-chave-secreta"
        ;;
    4)
        echo -e "${YELLOW}=== TESTANDO BACKEND LOCAL ===${NC}"
        echo "Verificando se o backend local está funcionando..."
        
        if curl -s http://localhost:5001/api/health > /dev/null; then
            echo -e "${GREEN}✅ Backend local funcionando!${NC}"
            echo "URL: http://localhost:5001"
            echo ""
            echo "Resposta do health check:"
            curl -s http://localhost:5001/api/health | python3 -m json.tool
        else
            echo -e "${YELLOW}❌ Backend local não está rodando${NC}"
            echo "Para iniciar:"
            echo "cd back-end && npm start"
        fi
        ;;
    *)
        echo "Opção inválida!"
        ;;
esac

echo ""
echo -e "${BLUE}📋 Checklist após deploy:${NC}"
echo "1. ✅ Backend deployado"
echo "2. ⚙️  Variáveis de ambiente configuradas"
echo "3. 🔗 URL do backend copiada"
echo "4. 🔄 Atualizar VITE_API_URL no frontend"
echo "5. 🚀 Testar endpoints"
