import { useState, useEffect, useCallback } from 'react';

const useSystemStatus = () => {
    const [isActive, setIsActive] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [notification, setNotification] = useState(null);
    const [systemMessage, setSystemMessage] = useState(null);
    const [showInactiveModal, setShowInactiveModal] = useState(false);

    // Verificar estado del sistema desde el backend
    const checkSystemStatus = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8081/api/system/status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Estado del sistema:', data);
                
                // Si el sistema está desactivado, mostrar modal
                if (!data.activo) {
                    setIsActive(false);
                    
                    // Usar directamente los datos del backend
                    setSystemMessage(data);
                    setShowInactiveModal(true);
                } else {
                    setIsActive(true);
                    setShowInactiveModal(false);
                }
                setIsConnected(true);
            } else {
                console.warn('⚠️ No se pudo verificar el estado del sistema');
                setIsConnected(false);
            }
        } catch (error) {
            console.warn('⚠️ Error verificando estado del sistema:', error.message);
            setIsConnected(false);
        }
    }, []);

    // Configurar WebSocket para recibir notificaciones
    useEffect(() => {
        let ws = null;
        let reconnectTimeout = null;
        let isConnecting = false;
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 3;
        
        const connectWebSocket = () => {
            // Evitar múltiples conexiones
            if (isConnecting || (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN))) {
                return;
            }
            
            isConnecting = true;
            reconnectAttempts++;
            
            try {
                ws = new WebSocket('ws://localhost:8081/ws');
                
                ws.onopen = () => {
                    console.log('✅ WebSocket conectado');
                    setIsConnected(true);
                    isConnecting = false;
                    reconnectAttempts = 0; // Reset attempts on successful connection
                };
                
                ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        console.log('📨 Mensaje WebSocket recibido:', message);
                        
                        // Procesar mensaje según el tipo
                        if (message.type === 'SYSTEM_DEACTIVATED') {
                            // Sistema se desactiva - mostrar modal
                            setIsActive(false);
                            
                            // Usar directamente los datos del WebSocket
                            setSystemMessage(message);
                            setShowInactiveModal(true);
                            showNotification('Sistema Desactivado', message.message, 'warning', 0);
                        } else if (message.type === 'SYSTEM_ACTIVATED') {
                            // Sistema se activa - ocultar modal automáticamente
                            setIsActive(true);
                            setSystemMessage(null);
                            setShowInactiveModal(false);
                            showNotification('Sistema Activado', message.message, 'success', 5000);
                        }
                    } catch (error) {
                        console.error('❌ Error parseando mensaje WebSocket:', error);
                    }
                };
                
                ws.onclose = () => {
                    console.log('🔌 WebSocket desconectado');
                    setIsConnected(false);
                    isConnecting = false;
                    
                    // Solo reconectar si no hemos excedido el límite
                    if (reconnectAttempts < maxReconnectAttempts) {
                        console.log(`🔄 Reintentando conexión (${reconnectAttempts}/${maxReconnectAttempts})...`);
                        reconnectTimeout = setTimeout(connectWebSocket, 5000);
                    } else {
                        console.log('❌ Máximo de intentos de reconexión alcanzado');
                    }
                };
                
                ws.onerror = (error) => {
                    console.log('⚠️ Error WebSocket - intentando reconectar...');
                    setIsConnected(false);
                    isConnecting = false;
                };
                
            } catch (error) {
                console.log('⚠️ Error conectando WebSocket:', error);
                isConnecting = false;
            }
        };
        
        // Conectar WebSocket
        connectWebSocket();
        
        return () => {
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            if (ws) {
                ws.close();
            }
        };
    }, []); // Solo ejecutar una vez

    // Verificar estado inicial
    useEffect(() => {
        console.log('🚀 Inicializando useSystemStatus...');
        checkSystemStatus();
    }, [checkSystemStatus]);

    // Forzar consulta inicial después de un breve delay
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('🔄 Forzando consulta inicial...');
            checkSystemStatus();
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);


    // Limpiar notificación
    const clearNotification = useCallback(() => {
        setNotification(null);
    }, []);

    // Mostrar notificación
    const showNotification = useCallback((title, message, type = 'info', duration = 5000) => {
        setNotification({
            title,
            message,
            type,
            duration
        });
    }, []);


    return {
        // Estados
        isActive,
        isConnected,
        notification,
        systemMessage,
        showInactiveModal,
        
        // Funciones
        clearNotification,
        showNotification,
        checkSystemStatus
    };
};

export default useSystemStatus;