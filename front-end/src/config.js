// API Configuration
const config = {
  // Determine API URL based on environment
  API_URL: import.meta.env.VITE_API_URL || 
           (import.meta.env.MODE === 'production' 
             ? 'https://tech-recruit.onrender.com' 
             : 'http://localhost:5001'),
  
  // Other configuration
  APP_NAME: 'Tech Recruit',
  VERSION: '1.0.0',
  
  // Feature flags
  FEATURES: {
    AUTHENTICATION: true,
    JOB_FILTERING: true,
    DEMO_MODE: true,
  },
  
  // Demo credentials
  DEMO_CREDENTIALS: {
    email: 'demo@teste.com',
    password: '123456'
  }
};

export default config;
