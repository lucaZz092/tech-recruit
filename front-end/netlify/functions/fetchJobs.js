// netlify/functions/fetchJobs.js

import fetch from 'node-fetch';

export const handler = async (event, context) => {
  // 1. MUDANÇA: Apontamos para a nova e mais estável API da Jobicy
  const API_URL = 'https://jobicy.com/api/v2/remote-jobs?count=6&tag=react';

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`A API da Jobicy respondeu com o status: ${response.status}`);
    }
    
    const data = await response.json();

    // Verificamos se a resposta contém as vagas
    if (!data.jobs) {
        throw new Error('A API da Jobicy não retornou os dados de vagas esperados.');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('Erro na função serverless:', error); 
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};