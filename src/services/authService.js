// Servicio de autenticación simple sin dependencias de Node.js
class AuthService {
  constructor() {
    this.token = null;
    this.user = null;
  }

  // Generar token simple para WebSocket (sin JWT)
  generateToken(userData = {}) {
    const payload = {
      sub: userData.username || 'anonymous',
      userId: userData.userId || 1,
      role: userData.role || 'USER',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    };

    // Crear token simple en base64 (no es JWT real, solo para identificación)
    this.token = btoa(JSON.stringify(payload));
    this.user = userData;
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('yego_token', this.token);
    localStorage.setItem('yego_user', JSON.stringify(userData));
    
    return this.token;
  }

  // Obtener token actual
  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('yego_token');
    }
    return this.token;
  }

  // Verificar si hay token válido
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = JSON.parse(atob(token));
      return decoded.exp > Math.floor(Date.now() / 1000);
    } catch (error) {
      console.warn('Token inválido:', error.message);
      this.clearAuth();
      return false;
    }
  }

  // Limpiar autenticación
  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('yego_token');
    localStorage.removeItem('yego_user');
  }

  // Obtener usuario actual
  getCurrentUser() {
    if (!this.user) {
      const userStr = localStorage.getItem('yego_user');
      if (userStr) {
        this.user = JSON.parse(userStr);
      }
    }
    return this.user;
  }

  // Generar token para WebSocket con datos específicos
  generateWebSocketToken() {
    const userData = this.getCurrentUser() || {
      username: 'websocket_user',
      userId: 999,
      role: 'WEBSOCKET'
    };

    return this.generateToken(userData);
  }
}

// Exportar instancia singleton
export default new AuthService();
