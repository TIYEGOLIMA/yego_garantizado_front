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

export const JWT_CONFIG = {
    // Clave secreta para desarrollo (la que apareció en los logs)
    developmentSecret: 'YegoBackendSecretKey2024VerySecureAndLongEnoughForHS512AlgorithmWithAtLeast64Characters',
    // Clave secreta para producción (la real del backend)
    productionSecret: import.meta.env.VITE_JWT_SECRET || 'cb0d12d0302705aba616440ca4f65dee7ec31810497a80e1b2e2e60b95c5437ea2aac09d4c2f8dd8f94c7899e2f6dcfde371182c6daa152cc8614f33f5be12ff',
    // Usar la clave según el entorno
    getSecret: () => isProduction ? JWT_CONFIG.productionSecret : JWT_CONFIG.developmentSecret
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
