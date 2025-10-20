// Configuración centralizada
import { API_CONFIG } from './environment.js';

const API_BASE_URL = API_CONFIG.baseUrl;
const WS_BASE_URL = API_CONFIG.wsUrl;

export const API_ENDPOINTS = {
  // Backend Garantizado - HTTP
  GARANTIZADO_BASE_URL: API_BASE_URL,
  
  // WebSocket
  WS_BASE_URL: WS_BASE_URL,
  
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

