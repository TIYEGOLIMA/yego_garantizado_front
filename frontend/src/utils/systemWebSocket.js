/**
 * WebSocket para recibir notificaciones del sistema
 * Conecta con el backend en puerto 8081
 */

class SystemWebSocket {
    constructor() {
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 5000; // 5 segundos
        this.isConnected = false;
    }

    /**
     * Conectar al WebSocket del backend
     */
    connect() {
        try {
            this.socket = new WebSocket('ws://localhost:8081/ws');
            
            this.socket.onopen = (event) => {
                console.log('🔌 Conectado al sistema de notificaciones');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.onConnectionEstablished();
            };

            this.socket.onmessage = (event) => {
                try {
                    const notification = JSON.parse(event.data);
                    console.log('📨 Notificación del sistema:', notification);
                    this.handleSystemNotification(notification);
                } catch (error) {
                    console.error('❌ Error parseando notificación:', error);
                }
            };

            this.socket.onclose = (event) => {
                console.log('🔌 Conexión WebSocket cerrada');
                this.isConnected = false;
                this.attemptReconnect();
            };

            this.socket.onerror = (error) => {
                console.error('❌ Error en WebSocket:', error);
                this.isConnected = false;
            };

        } catch (error) {
            console.error('❌ Error conectando WebSocket:', error);
            this.attemptReconnect();
        }
    }

    /**
     * Manejar notificaciones del sistema
     */
    handleSystemNotification(notification) {
        if (notification.type === 'SYSTEM_DEACTIVATED') {
            this.blockSystem(notification);
        } else if (notification.type === 'SYSTEM_ACTIVATED') {
            this.enableSystem(notification);
        }
    }

    /**
     * Bloquear el sistema cuando se desactiva
     */
    blockSystem(notification) {
        console.log('🚫 Sistema desactivado - Bloqueando interfaz');
        
        // Ocultar formulario de registro
        const registrationForm = document.getElementById('registrationForm');
        if (registrationForm) {
            registrationForm.style.display = 'none';
        }

        // Mostrar mensaje de sistema desactivado
        const systemMessage = document.getElementById('systemMessage');
        if (systemMessage) {
            systemMessage.innerHTML = `
                <div class="alert alert-danger" style="margin: 20px; padding: 20px; border-radius: 8px; background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24;">
                    <h3 style="margin-top: 0; color: #721c24;">🚫 Sistema Temporalmente Desactivado</h3>
                    <p><strong>Mensaje:</strong> ${notification.message}</p>
                    <p><strong>Horario de atención:</strong> Lunes a Viernes de 6:00 AM a 11:59 PM</p>
                    <p><strong>Hora actual:</strong> ${new Date(notification.timestamp).toLocaleString()}</p>
                    <div style="margin-top: 15px; padding: 10px; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px;">
                        <small>El sistema se reactivará automáticamente el próximo lunes a las 6:00 AM</small>
                    </div>
                </div>
            `;
            systemMessage.style.display = 'block';
        }

        // Deshabilitar botones de validación
        const validateButtons = document.querySelectorAll('[data-action="validate"]');
        validateButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
        });

        // Mostrar notificación toast
        this.showToast('Sistema desactivado', 'El sistema está temporalmente fuera de servicio', 'error');
    }

    /**
     * Habilitar el sistema cuando se activa
     */
    enableSystem(notification) {
        console.log('✅ Sistema activado - Habilitando interfaz');
        
        // Mostrar formulario de registro
        const registrationForm = document.getElementById('registrationForm');
        if (registrationForm) {
            registrationForm.style.display = 'block';
        }

        // Ocultar mensaje de sistema desactivado
        const systemMessage = document.getElementById('systemMessage');
        if (systemMessage) {
            systemMessage.style.display = 'none';
        }

        // Habilitar botones de validación
        const validateButtons = document.querySelectorAll('[data-action="validate"]');
        validateButtons.forEach(button => {
            button.disabled = false;
            button.style.opacity = '1';
        });

        // Mostrar notificación toast
        this.showToast('Sistema activado', 'El sistema está disponible para uso', 'success');
    }

    /**
     * Mostrar notificación toast
     */
    showToast(title, message, type = 'info') {
        // Crear elemento toast
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f8d7da' : '#d4edda'};
            color: ${type === 'error' ? '#721c24' : '#155724'};
            border: 1px solid ${type === 'error' ? '#f5c6cb' : '#c3e6cb'};
            border-radius: 8px;
            padding: 15px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;

        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">${type === 'error' ? '🚫' : '✅'}</span>
                <div>
                    <strong>${title}</strong><br>
                    <small>${message}</small>
                </div>
            </div>
        `;

        // Agregar estilos de animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(toast);

        // Remover después de 5 segundos
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }

    /**
     * Intentar reconectar
     */
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Intentando reconectar... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.connect();
            }, this.reconnectInterval);
        } else {
            console.error('❌ Máximo de intentos de reconexión alcanzado');
            this.showToast('Conexión perdida', 'No se pudo conectar al sistema de notificaciones', 'error');
        }
    }

    /**
     * Cuando se establece la conexión
     */
    onConnectionEstablished() {
        console.log('✅ Conexión establecida con el sistema de notificaciones');
    }

    /**
     * Desconectar
     */
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.isConnected = false;
        }
    }

    /**
     * Verificar si está conectado
     */
    getConnectionStatus() {
        return this.isConnected;
    }
}

// Crear instancia global
window.systemWebSocket = new SystemWebSocket();

// Conectar automáticamente cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando conexión WebSocket...');
    window.systemWebSocket.connect();
});

// Conectar cuando la página se vuelve visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !window.systemWebSocket.getConnectionStatus()) {
        console.log('🔄 Página visible - Reconectando WebSocket...');
        window.systemWebSocket.connect();
    }
});

export default SystemWebSocket;

