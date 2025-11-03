import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import Footer from './components/Footer'
import useSystemStatus from './hooks/useSystemStatus'

function App() {
  const {
    isActive,
    isConnected,
    notification,
    clearNotification,
    systemMessage,
    showInactiveModal
  } = useSystemStatus();

  const [showNotification, setShowNotification] = useState(false);
  const [mostrarTerminos, setMostrarTerminos] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Verificar estado del sistema al inicializar
  useEffect(() => {
    // Esperar un momento para que el hook useSystemStatus se inicialice
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 1500); // Dar tiempo suficiente para la verificación inicial
    
    return () => clearTimeout(timer);
  }, []);

  // Manejar notificaciones
  useEffect(() => {
    if (notification) {
      setShowNotification(true);
      
      // Auto-ocultar notificación después del tiempo especificado
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          setShowNotification(false);
          clearNotification();
        }, notification.duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [notification, clearNotification]);

  // Manejar clic en notificación para cerrarla
  const handleNotificationClick = () => {
    setShowNotification(false);
    clearNotification();
  };

  // Mostrar pantalla de carga mientras se inicializa
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-dark/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Verificando estado del sistema...</h2>
          <p className="text-gray-600">Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Notificación */}
      {showNotification && notification && (
        <div 
          className={`fixed top-5 right-5 bg-white rounded-lg p-4 shadow-lg border-l-4 max-w-sm z-50 cursor-pointer transform transition-all duration-300 ${
            notification.type === 'error' ? 'border-l-red-500' :
            notification.type === 'warning' ? 'border-l-orange-500' :
            notification.type === 'info' ? 'border-l-blue-500' : 'border-l-green-500'
          }`}
          onClick={handleNotificationClick}
        >
          <div className="font-bold text-gray-800 mb-1">{notification.title}</div>
          <div className="text-sm text-gray-600">{notification.message}</div>
        </div>
      )}

      {/* Modal de sistema inactivo - Se muestra inmediatamente si el sistema está inactivo */}
      {showInactiveModal && systemMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-11/12 text-center shadow-2xl border border-red-200">
            {/* Header simplificado */}
            <div className="mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-red-600 mb-2">Sistema Inactivo</h2>
              <p className="text-sm text-gray-600">{systemMessage.message || "No disponible en este momento"}</p>
            </div>
            
            {/* Información principal - Próxima activación - MÁS DESTACADA */}
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5 mb-4">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-base font-bold text-red-800">Se habilitará el</span>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-900 mb-1">
                  {systemMessage.proximaActivacion ? 
                    (() => {
                      const [datePart, timePart] = systemMessage.proximaActivacion.split(' ');
                      const [hour, minute] = timePart.split(':');
                      
                      // Convertir hora a formato 12h
                      const hour12 = hour % 12 || 12;
                      const ampm = hour < 12 ? 'AM' : 'PM';
                      
                      return `${datePart} - A las ${hour12}:${minute} ${ampm}`;
                    })() : "20/10/2025 - A las 6:00 AM"}
                </p>
              </div>
            </div>

            
            {/* Mensaje final - MÁS PEQUEÑO */}
            <div className="bg-red-100 border border-red-300 rounded-lg p-2">
              <p className="text-xs text-red-800 font-medium text-center">
                Se cerrará automáticamente al reactivarse
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal - Solo se muestra si el sistema está activo */}
      {!showInactiveModal && (
        <Routes>
          <Route path="/" element={<Navigate to="/garantizado" replace />} />
          <Route path="/garantizado" element={
            <div className="min-h-screen flex flex-col">
              <Hero isActive={isActive} isConnected={isConnected} mostrarTerminos={mostrarTerminos} setMostrarTerminos={setMostrarTerminos} />
              <Footer onMostrarTerminos={() => setMostrarTerminos(true)} />
            </div>
          } />
        </Routes>
      )}
    </div>
  )
}

export default App
