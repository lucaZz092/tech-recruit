#!/bin/bash

echo "🧪 Script de Teste - Tech Recruit"
echo "================================="

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Função para testar endpoint
test_endpoint() {
    local url=$1
    local description=$2
    
    echo -e "${BLUE}Testando: $description${NC}"
    echo "URL: $url"
    
    response=$(curl -s -w "%{http_code}" -o response.tmp "$url")
    http_code=${response: -3}
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✅ SUCESSO (HTTP $http_code)${NC}"
        cat response.tmp | head -3
    else
        echo -e "${RED}❌ ERRO (HTTP $http_code)${NC}"
        cat response.tmp
    fi
    
    rm -f response.tmp
    echo ""
}

# Solicitar URLs
read -p "Digite a URL do seu backend no Render: " BACKEND_URL
read -p "Digite a URL do seu frontend no Vercel: " FRONTEND_URL

echo ""
echo -e "${YELLOW}=== TESTANDO BACKEND ===${NC}"

# Teste 1: Health Check
test_endpoint "$BACKEND_URL/api/health" "Health Check"

# Teste 2: Login
echo -e "${BLUE}Testando: Login Demo${NC}"
login_response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@teste.com","password":"123456"}' \
  "$BACKEND_URL/api/demo/auth/login")

if echo "$login_response" | grep -q "success"; then
    echo -e "${GREEN}✅ Login funcionando${NC}"
    echo "$login_response" | head -3
else
    echo -e "${RED}❌ Erro no login${NC}"
    echo "$login_response"
fi
echo ""

# Teste 3: Lista de Vagas
test_endpoint "$BACKEND_URL/api/demo/jobs" "Lista de Vagas"

echo -e "${YELLOW}=== TESTANDO FRONTEND ===${NC}"

# Teste 4: Frontend
echo -e "${BLUE}Testando: Frontend${NC}"
echo "URL: $FRONTEND_URL"

frontend_response=$(curl -s -w "%{http_code}" -o frontend.tmp "$FRONTEND_URL")
frontend_code=${frontend_response: -3}

if [ "$frontend_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Frontend carregando${NC}"
    if grep -q "Tech Recruit" frontend.tmp; then
        echo -e "${GREEN}✅ Conteúdo correto encontrado${NC}"
    else
        echo -e "${YELLOW}⚠️  Conteúdo pode estar incorreto${NC}"
    fi
else
    echo -e "${RED}❌ Frontend com erro (HTTP $frontend_code)${NC}"
fi

rm -f frontend.tmp
echo ""

echo -e "${BLUE}=== CHECKLIST FINAL ===${NC}"
echo "1. ✅ Backend Health Check"
echo "2. ✅ API de Login"
echo "3. ✅ API de Vagas" 
echo "4. ✅ Frontend Carregando"
echo ""
echo -e "${GREEN}🎉 Se todos os testes passaram, sua aplicação está funcionando!${NC}"
echo ""
echo -e "${YELLOW}📋 Para testar manualmente:${NC}"
echo "1. Acesse: $FRONTEND_URL"
echo "2. Faça login com: demo@teste.com / 123456"
echo "3. Navegue pelas vagas"
echo "4. Teste os filtros"
echo ""
echo -e "${BLUE}🔍 Para debug, verifique:${NC}"
echo "- Console do navegador (F12)"
echo "- Network tab (requisições)"
echo "- Logs do Render"
echo "- Logs do Vercel"
