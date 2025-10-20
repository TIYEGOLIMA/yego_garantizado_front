const API_BASE_URL = 'http://localhost:8081'

export const API_ENDPOINTS = {
  // Backend Garantizado (puerto 8081) - HTTP
  GARANTIZADO_BASE_URL: 'http://localhost:8081',
  
  // Endpoints específicos
  GARANTIZADO: {
    HEALTH: '/api/health',
    SYSTEM_STATUS: '/api/system/status', 
    SYSTEM_PROCESS: '/api/system/process'
  },
  
  // Endpoints existentes
  FLOTAS: `${API_BASE_URL}/api/flotas`,
  REGISTROS: `${API_BASE_URL}/api/registros`,
  VALIDAR_LICENCIA: (licenseNumber) => `${API_BASE_URL}/api/drivers/validar/${licenseNumber}`,
  FLOTAS_CONDUCTOR: (licenseNumber) => `${API_BASE_URL}/api/drivers/flotas/${licenseNumber}`
}

export default API_BASE_URL

