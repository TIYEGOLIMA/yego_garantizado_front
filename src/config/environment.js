// Configuración basada en variables de entorno
const isProduction = import.meta.env.VITE_APP_ENV === 'production';

export const ENVIRONMENT = {
    isProduction,
    isDevelopment: !isProduction,
    name: import.meta.env.VITE_APP_ENV || 'development'
};

export const API_CONFIG = {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030',
    wsUrl: import.meta.env.VITE_WS_URL || 'http://localhost:3030/ws',
    corsOrigin: import.meta.env.VITE_CORS_ORIGIN || 'http://localhost:5173'
};

export const LOG_CONFIG = {
    level: import.meta.env.VITE_LOG_LEVEL || 'debug',
    debug: import.meta.env.VITE_DEBUG_MODE === 'true'
};

// Logs de configuración
console.log('🌍 [ENV] Entorno:', ENVIRONMENT.name);
console.log('🌍 [API] URL Base:', API_CONFIG.baseUrl);
console.log('🌍 [API] URL WebSocket:', API_CONFIG.wsUrl);
console.log('🌍 [API] CORS Origin:', API_CONFIG.corsOrigin);
console.log('🌍 [LOG] Nivel:', LOG_CONFIG.level);

export default {
    ENVIRONMENT,
    API_CONFIG,
    LOG_CONFIG
};
