# Netlify Deploy Script
# Para fazer deploy do backend como Netlify Functions

echo "🚀 Deploy Backend como Netlify Functions"
echo "========================================"

# Criar estrutura para Netlify Functions
mkdir -p netlify/functions

# Criar função serverless para a API
cat > netlify/functions/api.js << 'EOF'
const express = require('express');
const serverless = require('serverless-http');

// Importar o app do backend
const app = require('../../back-end/server.js');

// Exportar como função serverless
module.exports.handler = serverless(app);
EOF

echo "✅ Estrutura criada para Netlify Functions"
echo "📝 Próximos passos:"
echo "1. Faça commit das mudanças"
echo "2. Conecte o repositório no Netlify"
echo "3. Configure as variáveis de ambiente"
echo "4. Deploy automático!"
