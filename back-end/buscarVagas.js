const axios = require('axios');

// 1. Usando a URL da API da Remotive, que está no ar e funcionando!
const apiUrl = 'https://remotive.io/api/remote-jobs?limit=50';

async function getJobs() {
  try {
    // A MENSAGEM AQUI É DIFERENTE, NOTE!
    console.log('Indo buscar as vagas na API da Remotive...');

    const response = await axios.get(apiUrl);

    // 2. Os dados estão em response.data.jobs
    const vagas = response.data.jobs;

    console.log('Vagas recebidas com sucesso!');
    console.log(`Encontramos um total de ${vagas.length} vagas.`);

    // 3. Mostrando a primeira vaga com os campos da nova API
    if (vagas.length > 0) {
      console.log('--- Exemplo da primeira vaga ---');
      console.log('Título:', vagas[0].title);
      console.log('Empresa:', vagas[0].company_name);
      console.log('Tipo:', vagas[0].job_type);
      console.log('Link:', vagas[0].url);
      console.log('-----------------------------');
    } else {
      console.log('Nenhuma vaga foi encontrada no momento.');
    }

  } catch (error) {
    console.error('Ocorreu um erro ao buscar as vagas:', error.message);
  }
}

// Executamos a função
getJobs();