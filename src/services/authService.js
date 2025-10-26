// Servicio de autenticación simple sin dependencias de Node.js
class AuthService {
  constructor() {
    this.token = null;
    this.user = null;
  }

  // Función para convertir Base64 a Base64URL
  base64ToBase64URL(base64) {
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // Función para generar HMAC-SHA256
  async hmacSha256(message, secret) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(message);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const signatureArray = new Uint8Array(signature);
    const signatureBase64 = btoa(String.fromCharCode(...signatureArray));
    
    // Convertir a Base64URL
    return this.base64ToBase64URL(signatureBase64);
  }

  // Generar JWT real para el backend con la clave correcta
  async generateToken(userData = {}) {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload = {
      sub: userData.username || 'anonymous',
      userId: userData.userId || 1,
      role: userData.role || 'USER',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    };

    // Crear JWT con la clave secreta del backend
    const encodedHeader = this.base64ToBase64URL(btoa(JSON.stringify(header)));
    const encodedPayload = this.base64ToBase64URL(btoa(JSON.stringify(payload)));
    
    // Usar la clave secreta real del backend
    const secretKey = 'YegoBackendSecretKey2024VerySecureAndLongEnoughForHS512AlgorithmWithAtLeast64Characters';
    const message = `${encodedHeader}.${encodedPayload}`;
    const signature = await this.hmacSha256(message, secretKey);
    
    this.token = `${encodedHeader}.${encodedPayload}.${signature}`;
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

  // Función para convertir Base64URL a Base64
  base64URLToBase64(base64url) {
    // Agregar padding si es necesario
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return base64;
  }

  // Verificar si hay token válido
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Verificar que sea un JWT válido (debe tener 2 puntos)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token no es un JWT válido');
      }

      // Decodificar el payload (segunda parte) - convertir de Base64URL a Base64
      const payloadBase64 = this.base64URLToBase64(parts[1]);
      const decoded = JSON.parse(atob(payloadBase64));
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
  async generateWebSocketToken() {
    // Siempre usar datos específicos para el sistema de garantizado
    const userData = {
      username: 'garantizado',
      userId: 9999,
      role: 'SISEXTERNO'
    };

    return await this.generateToken(userData);
  }
}

// Exportar instancia singleton
export default new AuthService();
