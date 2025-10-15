// Configuração da API
const API_BASE_URL = 'http://localhost:5001/api';

// Classe para gerenciar requisições à API
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método genérico para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Adicionar token de autenticação se disponível
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // Métodos GET
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, { method: 'GET' });
  }

  // Métodos POST
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Métodos PUT
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Métodos DELETE
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // ========== JOBS ==========
  
  // Buscar vagas com filtros
  async getJobs(filters = {}) {
    return this.get('/demo/jobs', filters);
  }

  // Buscar vagas aleatórias
  async getRandomJobs(count = 25) {
    return this.get('/demo/jobs/random', { count });
  }

  // Buscar vaga específica
  async getJob(id) {
    return this.get(`/demo/jobs/${id}`);
  }

  // ========== AUTHENTICATION ==========
  
  // Login
  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  // Registro
  async register(userData) {
    const response = await this.post('/auth/register', userData);
    
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Obter dados do usuário atual
  async getCurrentUser() {
    return this.get('/auth/me');
  }

  // ========== USER MANAGEMENT ==========
  
  // Atualizar perfil
  async updateProfile(profileData) {
    return this.put('/auth/profile', profileData);
  }

  // Obter candidaturas do usuário
  async getUserApplications() {
    return this.get('/users/applications');
  }

  // Obter vagas favoritas
  async getFavoriteJobs() {
    return this.get('/users/favorites');
  }

  // ========== JOB INTERACTIONS ==========
  
  // Candidatar-se a uma vaga
  async applyToJob(jobId) {
    return this.post(`/jobs/${jobId}/apply`);
  }

  // Favoritar/desfavoritar vaga
  async toggleFavoriteJob(jobId) {
    return this.post(`/jobs/${jobId}/favorite`);
  }

  // ========== UTILITIES ==========
  
  // Verificar se usuário está logado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Obter usuário do localStorage
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Health check da API
  async healthCheck() {
    return this.get('/health');
  }
}

// Instância singleton da API
const apiService = new ApiService();

// Exportar métodos específicos para facilitar importação
export const {
  // Jobs
  getJobs,
  getRandomJobs,
  getJob,
  
  // Auth
  login,
  register,
  logout,
  getCurrentUser,
  
  // User
  updateProfile,
  getUserApplications,
  getFavoriteJobs,
  
  // Job interactions
  applyToJob,
  toggleFavoriteJob,
  
  // Utils
  isAuthenticated,
  getStoredUser,
  healthCheck
} = apiService;

export default apiService;
