import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../config/api';
import authService from '../services/authService';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const useSystemStatus = () => {
    const [isActive, setIsActive] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [notification, setNotification] = useState(null);
    const [systemMessage, setSystemMessage] = useState(null);
    const [showInactiveModal, setShowInactiveModal] = useState(false);

    // Verificar estado del sistema desde el backend
    const checkSystemStatus = useCallback(async () => {
        try {
            // Obtener token para autenticación
            const token = authService.getToken();
            
            const response = await fetch(`${API_ENDPOINTS.GARANTIZADO_BASE_URL}${API_ENDPOINTS.GARANTIZADO.SYSTEM_STATUS}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
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

    // Configurar STOMP WebSocket para recibir notificaciones
    useEffect(() => {
        let stompClient = null;
        let reconnectTimeout = null;
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 3;
        
        const connectStomp = () => {
            // Evitar múltiples conexiones
            if (stompClient && stompClient.connected) {
                return;
            }
            
            try {
                // Generar token JWT para WebSocket
                const token = authService.generateWebSocketToken();
                console.log('🔐 [STOMP] Token generado para conexión:', token ? 'Sí' : 'No');
                console.log('🌐 [STOMP] URL WebSocket:', API_ENDPOINTS.WS_BASE_URL);
                
                 // Usar URL centralizada de configuración
                 const stompUrl = API_ENDPOINTS.WS_BASE_URL;
                 console.log('🌐 [STOMP] URL WebSocket:', stompUrl);
                 
                 stompClient = new Client({
                     webSocketFactory: () => new SockJS(stompUrl),
                     connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
                     debug: (str) => console.log('STOMP:', str),
                     reconnectDelay: 5000,
                     heartbeatIncoming: 4000,
                     heartbeatOutgoing: 4000,
                 });
                
                stompClient.onConnect = (frame) => {
                    console.log('✅ STOMP conectado:', frame);
                    setIsConnected(true);
                    reconnectAttempts = 0;
                    
                    // Suscribirse a los tópicos del sistema
                    stompClient.subscribe('/topic/system', (message) => {
                        try {
                            const data = JSON.parse(message.body);
                            console.log('📨 Mensaje STOMP recibido en /topic/system:', data);
                            handleSystemMessage(data);
                        } catch (error) {
                            console.error('❌ Error parseando mensaje STOMP:', error);
                        }
                    });
                    
                    stompClient.subscribe('/topic/garantizado', (message) => {
                        try {
                            const data = JSON.parse(message.body);
                            console.log('📨 Mensaje STOMP recibido en /topic/garantizado:', data);
                            handleSystemMessage(data);
                        } catch (error) {
                            console.error('❌ Error parseando mensaje STOMP:', error);
                        }
                    });
                    
                    stompClient.subscribe('/topic/system-status', (message) => {
                        try {
                            const data = JSON.parse(message.body);
                            console.log('📨 Mensaje STOMP recibido en /topic/system-status:', data);
                            handleSystemMessage(data);
                        } catch (error) {
                            console.error('❌ Error parseando mensaje STOMP:', error);
                        }
                    });
                };
                
                stompClient.onStompError = (frame) => {
                    console.error('❌ Error STOMP:', frame.headers.message);
                    setIsConnected(false);
                };
                
                stompClient.onWebSocketClose = (event) => {
                    console.log('🔌 STOMP desconectado:', event);
                    setIsConnected(false);
                    
                    // Reconectar si no hemos excedido el límite
                    if (reconnectAttempts < maxReconnectAttempts) {
                        console.log(`🔄 Reintentando conexión STOMP (${reconnectAttempts}/${maxReconnectAttempts})...`);
                        reconnectAttempts++;
                        reconnectTimeout = setTimeout(connectStomp, 5000);
                    } else {
                        console.log('❌ Máximo de intentos de reconexión STOMP alcanzado');
                    }
                };
                
                // Conectar
                stompClient.activate();
                
            } catch (error) {
                console.log('⚠️ Error conectando STOMP:', error);
                setIsConnected(false);
            }
        };
        
        // Función para manejar mensajes del sistema
        const handleSystemMessage = (message) => {
            if (message.type === 'SYSTEM_DEACTIVATED') {
                // Sistema se desactiva - mostrar modal
                setIsActive(false);
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
        };
        
        // Conectar STOMP
        connectStomp();
        
        return () => {
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, []); // Solo ejecutar una vez

    // Verificar estado inicial
    useEffect(() => {
        console.log('🚀 Inicializando useSystemStatus...');
        
        // Generar token si no existe
        if (!authService.isAuthenticated()) {
            console.log('🔐 Generando token inicial...');
            authService.generateWebSocketToken();
        }
        
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