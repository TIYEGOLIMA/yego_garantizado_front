import React, { useState, useEffect } from 'react';
import SystemWebSocket from '../utils/systemWebSocket';

/**
 * Componente para mostrar el estado del sistema
 * Se conecta automáticamente al WebSocket del backend
 */
const SystemStatus = () => {
    const [isSystemActive, setIsSystemActive] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState('Conectando...');
    const [lastNotification, setLastNotification] = useState(null);

    useEffect(() => {
        // Verificar estado inicial del sistema
        checkInitialSystemStatus();

        // Configurar listeners para el WebSocket
        const handleSystemNotification = (notification) => {
            console.log('📨 Notificación recibida en React:', notification);
            setLastNotification(notification);
            
            if (notification.type === 'SYSTEM_DEACTIVATED') {
                setIsSystemActive(false);
                setConnectionStatus('Sistema desactivado');
            } else if (notification.type === 'SYSTEM_ACTIVATED') {
                setIsSystemActive(true);
                setConnectionStatus('Sistema activo');
            }
        };

        // Agregar listener personalizado
        window.addEventListener('systemNotification', (event) => {
            handleSystemNotification(event.detail);
        });

        return () => {
            window.removeEventListener('systemNotification', handleSystemNotification);
        };
    }, []);

    /**
     * Verificar estado inicial del sistema
     */
    const checkInitialSystemStatus = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/system/status');
            const data = await response.json();
            setIsSystemActive(data.activo);
            setConnectionStatus(data.activo ? 'Sistema activo' : 'Sistema desactivado');
        } catch (error) {
            console.error('Error verificando estado del sistema:', error);
            setConnectionStatus('Error de conexión');
        }
    };

    /**
     * Renderizar mensaje de sistema desactivado
     */
    const renderSystemDisabledMessage = () => {
        if (isSystemActive) return null;

        return (
            <div className="system-disabled-message" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                color: 'white'
            }}>
                <div style={{
                    backgroundColor: '#721c24',
                    padding: '30px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    maxWidth: '500px',
                    margin: '20px'
                }}>
                    <h2 style={{ marginTop: 0, color: '#f8d7da' }}>🚫 Sistema Temporalmente Desactivado</h2>
                    <p>El sistema está fuera de servicio durante el fin de semana.</p>
                    <p><strong>Horario de atención:</strong> Lunes a Viernes de 6:00 AM a 11:59 PM</p>
                    {lastNotification && (
                        <p><small>Última actualización: {new Date(lastNotification.timestamp).toLocaleString()}</small></p>
                    )}
                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        backgroundColor: '#fff3cd',
                        color: '#856404',
                        borderRadius: '8px',
                        border: '1px solid #ffeaa7'
                    }}>
                        <small>El sistema se reactivará automáticamente el próximo lunes a las 6:00 AM</small>
                    </div>
                </div>
            </div>
        );
    };

    /**
     * Renderizar indicador de estado
     */
    const renderStatusIndicator = () => {
        return (
            <div style={{
                position: 'fixed',
                top: '10px',
                right: '10px',
                padding: '8px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: isSystemActive ? '#d4edda' : '#f8d7da',
                color: isSystemActive ? '#155724' : '#721c24',
                border: `1px solid ${isSystemActive ? '#c3e6cb' : '#f5c6cb'}`,
                zIndex: 1000
            }}>
                {isSystemActive ? '✅ Sistema Activo' : '🚫 Sistema Desactivado'}
            </div>
        );
    };

    return (
        <>
            {renderStatusIndicator()}
            {renderSystemDisabledMessage()}
        </>
    );
};

export default SystemStatus;

