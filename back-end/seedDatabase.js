const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./models/User');
const Job = require('./models/Job');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Conectar ao MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tech-recruit';
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado ao MongoDB');

    // Limpar dados existentes
    await User.deleteMany({});
    await Job.deleteMany({});
    console.log('🧹 Banco limpo');

    // Criar usuários de exemplo
    const users = await User.create([
      {
        name: 'João Developer',
        email: 'joao@teste.com',
        password: '123456',
        role: 'user',
        profile: {
          location: 'São Paulo, SP',
          bio: 'Desenvolvedor Full Stack com 3 anos de experiência',
          skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
          experience: 'mid'
        },
        preferences: {
          jobTypes: ['remote', 'hybrid'],
          technologies: ['javascript', 'react', 'node'],
          locations: ['São Paulo', 'Remote']
        }
      },
      {
        name: 'Maria Tech',
        email: 'maria@teste.com',
        password: '123456',
        role: 'user',
        profile: {
          location: 'Rio de Janeiro, RJ',
          bio: 'Especialista em Python e Data Science',
          skills: ['Python', 'Django', 'PostgreSQL', 'Machine Learning'],
          experience: 'senior'
        }
      },
      {
        name: 'TechCorp Recrutador',
        email: 'hr@techcorp.com',
        password: '123456',
        role: 'company',
        profile: {
          location: 'São Paulo, SP',
          bio: 'Empresa de tecnologia focada em inovação'
        }
      },
      {
        name: 'Admin Sistema',
        email: 'admin@techrecruit.com',
        password: '123456',
        role: 'admin'
      }
    ]);

    console.log('👥 Usuários criados:', users.length);

    // Buscar vagas reais da API para popular o banco
    const technologies = ['javascript', 'python', 'react', 'node', 'java'];
    let externalJobs = [];

    for (const tech of technologies) {
      try {
        const response = await axios.get(`https://jobicy.com/api/v2/remote-jobs?count=3&tag=${tech}`, {
          timeout: 5000
        });

        if (response.data.jobs) {
          const techJobs = response.data.jobs.map(job => ({
            jobTitle: job.jobTitle,
            companyName: job.companyName,
            jobDescription: job.jobDescription || `Vaga de ${job.jobTitle} na ${job.companyName}`,
            jobExcerpt: job.jobExcerpt || `Oportunidade para trabalhar como ${job.jobTitle}`,
            jobTags: job.jobTags || [tech, job.jobLevel, job.jobGeo].filter(Boolean),
            jobType: job.jobType || 'full-time',
            jobLevel: job.jobLevel || 'mid',
            jobGeo: job.jobGeo || 'Remote',
            isRemote: true,
            url: job.url,
            companyLogo: job.companyLogo,
            jobIndustry: job.jobIndustry,
            isExternal: true,
            source: 'jobicy',
            externalId: job.id.toString()
          }));
          
          externalJobs.push(...techJobs);
        }
      } catch (error) {
        console.warn(`Erro ao buscar ${tech}:`, error.message);
      }
    }

    // Criar vagas internas da empresa
    const companyUser = users.find(user => user.role === 'company');
    const internalJobs = [
      {
        jobTitle: 'Desenvolvedor React Senior',
        companyName: 'TechCorp',
        jobDescription: `
# Desenvolvedor React Senior

## Sobre a Vaga
Estamos procurando um(a) Desenvolvedor(a) React Senior para se juntar ao nosso time de inovação tecnológica.

## Responsabilidades
- Desenvolver aplicações web modernas usando React
- Colaborar com equipes de design e produto
- Mentorear desenvolvedores juniores
- Participar de code reviews e arquitetura

## Requisitos
- 4+ anos de experiência com React
- Conhecimento em TypeScript
- Experiência com testes automatizados
- Conhecimento em Git/GitHub

## Benefícios
- Salário competitivo
- Vale refeição e transporte
- Plano de saúde e odontológico
- Home office flexível
        `,
        jobExcerpt: 'Oportunidade para desenvolvedor React experiente em empresa inovadora',
        jobTags: ['React', 'TypeScript', 'JavaScript', 'Senior'],
        jobType: 'full-time',
        jobLevel: 'senior',
        jobGeo: 'São Paulo, SP (Híbrido)',
        isRemote: false,
        url: 'https://techcorp.com/careers/react-senior',
        requirements: [
          '4+ anos de experiência com React',
          'Conhecimento em TypeScript',
          'Experiência com testes automatizados',
          'Conhecimento em Git/GitHub'
        ],
        benefits: [
          'Salário competitivo',
          'Vale refeição e transporte',
          'Plano de saúde e odontológico',
          'Home office flexível'
        ],
        salary: { min: 8000, max: 12000, currency: 'BRL' },
        postedBy: companyUser._id,
        source: 'internal',
        isExternal: false
      },
      {
        jobTitle: 'Data Scientist Pleno',
        companyName: 'TechCorp',
        jobDescription: `
# Data Scientist Pleno

## Sobre a Vaga
Buscamos um(a) Cientista de Dados para trabalhar com análise de grandes volumes de dados e machine learning.

## Responsabilidades
- Análise exploratória de dados
- Desenvolvimento de modelos de ML
- Criação de dashboards e relatórios
- Colaboração com equipes de produto

## Requisitos
- 2+ anos de experiência em Data Science
- Python e bibliotecas (pandas, sklearn, etc.)
- Conhecimento em SQL
- Experiência com visualização de dados
        `,
        jobExcerpt: 'Vaga para cientista de dados trabalhar com ML e análise de dados',
        jobTags: ['Python', 'Data Science', 'Machine Learning', 'SQL'],
        jobType: 'full-time',
        jobLevel: 'mid',
        jobGeo: 'Remote',
        isRemote: true,
        url: 'https://techcorp.com/careers/data-scientist',
        postedBy: companyUser._id,
        source: 'internal',
        isExternal: false
      }
    ];

    // Criar todas as vagas
    const allJobs = [...externalJobs, ...internalJobs];
    const createdJobs = await Job.create(allJobs);
    
    console.log('💼 Vagas criadas:', createdJobs.length);
    console.log('  - Vagas externas:', externalJobs.length);
    console.log('  - Vagas internas:', internalJobs.length);

    // Criar algumas candidaturas de exemplo
    const userJoao = users[0];
    const userMaria = users[1];
    const sampleJobs = createdJobs.slice(0, 3);

    // João se candidata a algumas vagas
    for (let i = 0; i < 2; i++) {
      const job = sampleJobs[i];
      job.applications.push({
        userId: userJoao._id,
        appliedAt: new Date(),
        status: i === 0 ? 'applied' : 'viewed'
      });
      await job.save();

      userJoao.applications.push({
        jobId: job._id,
        appliedAt: new Date(),
        status: i === 0 ? 'applied' : 'viewed'
      });
    }

    // Maria se candidata e favorita vagas
    const job = sampleJobs[2];
    job.applications.push({
      userId: userMaria._id,
      appliedAt: new Date(),
      status: 'applied'
    });
    await job.save();

    userMaria.applications.push({
      jobId: job._id,
      appliedAt: new Date(),
      status: 'applied'
    });

    userMaria.favoriteJobs = [sampleJobs[0]._id, sampleJobs[1]._id];

    await userJoao.save();
    await userMaria.save();

    console.log('📝 Candidaturas de exemplo criadas');

    console.log('\n🎉 Database populado com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`👥 Usuários: ${users.length}`);
    console.log(`💼 Vagas: ${createdJobs.length}`);
    console.log('\n🔐 Usuários de teste:');
    console.log('📧 joao@teste.com / 123456 (user)');
    console.log('📧 maria@teste.com / 123456 (user)');
    console.log('📧 hr@techcorp.com / 123456 (company)');
    console.log('📧 admin@techrecruit.com / 123456 (admin)');

  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
  } finally {
    mongoose.disconnect();
    console.log('\n👋 Desconectado do MongoDB');
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
