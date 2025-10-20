import { useState, useEffect } from 'react'
import ModalTerminos from './ModalTerminos'
import { API_ENDPOINTS } from '../config/api'
import useSystemStatus from '../hooks/useSystemStatus'

export default function Hero() {
  // Hook para manejo del estado del sistema
  const { isActive, isConnected, isBlocked } = useSystemStatus();

  const [formData, setFormData] = useState({
    licenciaNumero: '',
    flota: '',
    terminosAceptados: false
  })

  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [exitoso, setExitoso] = useState(false)
  const [mostrarTerminos, setMostrarTerminos] = useState(false)
  const [flotas, setFlotas] = useState([])
  const [cargandoFlotas, setCargandoFlotas] = useState(false)
  
  // Estados para validación de licencia
  const [licenciaValidada, setLicenciaValidada] = useState(false)
  const [datosDriver, setDatosDriver] = useState(null)
  const [validandoLicencia, setValidandoLicencia] = useState(false)
  const [mensajeValidacion, setMensajeValidacion] = useState('')
  
  // Estados para modal de redirección
  const [mostrarModalRedireccion, setMostrarModalRedireccion] = useState(false)
  const [contadorRedireccion, setContadorRedireccion] = useState(5)
  
  // Estados para sistema inactivo (mantener para compatibilidad)
  const [sistemaActivo, setSistemaActivo] = useState(true)


  // Sincronizar con el estado del sistema
  useEffect(() => {
    setSistemaActivo(isActive);
  }, [isActive]);

  // Efecto para manejar el contador de redirección
  useEffect(() => {
    let interval = null
    if (mostrarModalRedireccion && contadorRedireccion > 0) {
      interval = setInterval(() => {
        setContadorRedireccion(contador => contador - 1)
      }, 1000)
    } else if (contadorRedireccion === 0) {
      // Redireccionar automáticamente
      window.open('https://linktr.ee/yegooficial', '_blank')
      setMostrarModalRedireccion(false)
      setContadorRedireccion(5)
      
      // Limpiar formulario después de redirección automática
      setFormData({
        licenciaNumero: '',
        flota: '',
        terminosAceptados: false
      })
      setFlotas([])
      setErrores({})
      setLicenciaValidada(false)
      setDatosDriver(null)
      setMensajeValidacion('')
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [mostrarModalRedireccion, contadorRedireccion])

  const redirigirAhora = () => {
    window.open('https://linktr.ee/yegooficial', '_blank')
    setMostrarModalRedireccion(false)
    setContadorRedireccion(5)
    
    // Limpiar formulario después de redirigir
    setFormData({
      licenciaNumero: '',
      flota: '',
      terminosAceptados: false
    })
    setFlotas([])
    setErrores({})
    setLicenciaValidada(false)
    setDatosDriver(null)
    setMensajeValidacion('')
  }

  const cargarFlotasConductor = async (licenseNumber) => {
    try {
      setCargandoFlotas(true)
      const response = await fetch(API_ENDPOINTS.FLOTAS_CONDUCTOR(licenseNumber), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error('Error al cargar flotas del conductor')
      }
      
      const data = await response.json()
      
      // Convertir las flotas del conductor al formato esperado
      const flotasConductor = data.flotasDisponibles.map(flota => ({
        id: flota.parkId,
        name: flota.parkName,
        city: flota.city,
        activo: flota.activo
      }))
      
      setFlotas(flotasConductor)
    } catch (error) {
      console.error('Error al cargar flotas del conductor:', error)
      setFlotas([])
    } finally {
      setCargandoFlotas(false)
    }
  }

  const validarLicencia = async () => {
    if (!formData.licenciaNumero.trim()) {
      setErrores(prev => ({ ...prev, licenciaNumero: 'Ingresa un número de licencia' }))
      return
    }

    setValidandoLicencia(true)
    setMensajeValidacion('')
    setLicenciaValidada(false)
    setDatosDriver(null)
    setFlotas([]) // Limpiar flotas anteriores

    try {
      // Paso 1: Validar licencia
      const response = await fetch(API_ENDPOINTS.VALIDAR_LICENCIA(formData.licenciaNumero), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (response.ok) {
        if (data.existe) {
          setLicenciaValidada(true)
          setDatosDriver(data.driver)
          setMensajeValidacion(data.mensaje)
          setErrores(prev => ({ ...prev, licenciaNumero: '' }))
          
          // Paso 2: Cargar flotas específicas del conductor
          await cargarFlotasConductor(formData.licenciaNumero)
        } else {
          setLicenciaValidada(false)
          setDatosDriver(null)
          setMensajeValidacion(data.mensaje)
          setErrores(prev => ({ ...prev, licenciaNumero: data.mensaje }))
          
          // Mostrar modal de redirección para licencia no válida
          setMostrarModalRedireccion(true)
          setContadorRedireccion(5)
          
          // Limpiar formulario cuando la licencia no es válida
          setFormData({
            licenciaNumero: '',
            flota: '',
            terminosAceptados: false
          })
          setFlotas([])
          setErrores({})
        }
      } else {
        throw new Error('Error al validar licencia')
      }
    } catch (error) {
      console.error('Error al validar licencia:', error)
      setErrores(prev => ({ ...prev, licenciaNumero: 'Error al conectar con el servidor' }))
      setLicenciaValidada(false)
      setDatosDriver(null)
    } finally {
      setValidandoLicencia(false)
    }
  }

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Si cambia la licencia, resetear la validación y flotas
    if (name === 'licenciaNumero') {
      setLicenciaValidada(false)
      setDatosDriver(null)
      setMensajeValidacion('')
      setFlotas([])
      setFormData(prev => ({ ...prev, flota: '' })) // Resetear selección de flota
    }
    
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!formData.licenciaNumero.trim()) {
      nuevosErrores.licenciaNumero = 'El número de licencia es requerido'
    } else if (!licenciaValidada) {
      nuevosErrores.licenciaNumero = 'Debes validar la licencia primero'
    }

    if (!formData.flota) {
      nuevosErrores.flota = 'Selecciona un tipo de flota'
    }

    if (!formData.terminosAceptados) {
      nuevosErrores.terminosAceptados = 'Debes aceptar los términos y condiciones'
    }

    return nuevosErrores
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    
    // Verificar si el sistema está bloqueado
    if (isBlocked || !isActive) {
      setErrores({
        sistema: 'El sistema está temporalmente desactivado. No se pueden procesar solicitudes en este momento.'
      })
      return
    }
    
    const nuevosErrores = validarFormulario()
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setEnviando(true)
    
    const datosParaEnviar = {
      yegLicenciaNumero: formData.licenciaNumero,
      yegFlota: formData.flota,
      yegTerminosAceptados: formData.terminosAceptados
    }

    try {
      const response = await fetch(API_ENDPOINTS.REGISTROS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosParaEnviar)
      })

      const resultado = await response.json()

      if (response.ok) {
        setExitoso(true)
        setFormData({
          licenciaNumero: '',
          flota: '',
          terminosAceptados: false
        })
        
        // Resetear validación de licencia y flotas
        setLicenciaValidada(false)
        setDatosDriver(null)
        setMensajeValidacion('')
        setFlotas([])
        
        setTimeout(() => {
          setExitoso(false)
        }, 3000)
      } else {
        alert(resultado.mensaje || 'Error al registrar')
      }
    } catch (error) {
      console.error('Error al enviar registro:', error)
      alert('Error al conectar con el servidor. Por favor, intenta nuevamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-white">
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute w-96 h-96 bg-primary rounded-full top-0 right-0 blur-3xl animate-float"></div>
        <div className="absolute w-80 h-80 bg-primary rounded-full bottom-0 left-0 blur-3xl animate-float" style={{ animationDelay: '-7s' }}></div>
      </div>
      
      <div className="relative z-10 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <img src="/yego.png" alt="YEGO" className="h-8 md:h-10" />
        </div>
      </div>
      
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-4">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-dark space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white border-2 border-dark rounded-full text-sm font-bold">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-dark">ÚNETE AL EQUIPO</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-tight text-dark">
            Conduce y Gana tu{' '}
            <span className="text-primary">Bono</span>
            <br />
            Garantizado
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Genera ingresos flexibles manejando tu propio horario. 
            Sistema de garantizado atractivo y pagos puntuales.
          </p>
          
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white border-2 border-dark rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-dark">Garantizado</p>
                <p className="text-sm text-gray-500">Ingresos seguros</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white border-2 border-dark rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-dark">Pagos rápidos</p>
                <p className="text-sm text-gray-500">Sin demoras</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white border-2 border-dark rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-dark">App fácil</p>
                <p className="text-sm text-gray-500">Interfaz simple</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Gratis
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Sin compromiso
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Inicio inmediato
            </span>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {exitoso ? (
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-2 border-primary">
              <div className="mb-6">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-dark mb-3">
                  ¡Registro <span className="text-primary">Aprobado!</span>
                </h2>
                <p className="text-gray-600">
                  Nos pondremos en contacto contigo pronto.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-dark mb-6 text-center">
                <span className="text-primary">Regístrate</span> Ahora
              </h2>

              <form onSubmit={manejarEnvio} className="space-y-6">
Ç                {/* Error del sistema */}
                {errores.sistema && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800 font-medium">
                          {errores.sistema}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-dark mb-2">
                    Número de Licencia *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="licenciaNumero"
                      value={formData.licenciaNumero}
                      onChange={manejarCambio}
                      disabled={licenciaValidada || !sistemaActivo}
                      className={`flex-1 px-4 py-3 text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                        errores.licenciaNumero ? 'border-red-500' : licenciaValidada ? 'border-green-500 bg-green-50' : 'border-dark'
                      } ${(licenciaValidada || !sistemaActivo) ? 'opacity-75' : ''}`}
                      placeholder="Ej: ABC123"
                    />
                    <button
                      type="button"
                      onClick={validarLicencia}
                      disabled={validandoLicencia || licenciaValidada || !formData.licenciaNumero.trim() || !sistemaActivo}
                      className={`px-6 py-3 font-bold text-sm rounded-xl transition-all duration-300 border-2 ${
                        licenciaValidada 
                          ? 'bg-green-500 text-white border-green-500' 
                          : 'bg-primary text-white border-primary hover:bg-primary-dark hover:-translate-y-0.5'
                      } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                      {validandoLicencia ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : licenciaValidada ? (
                        '✓'
                      ) : (
                        'Validar'
                      )}
                    </button>
                  </div>
                  {errores.licenciaNumero && (
                    <p className="mt-2 text-sm text-red-500 font-medium">
                      {errores.licenciaNumero}
                    </p>
                  )}
                  {licenciaValidada && mensajeValidacion && (
                    <div className="mt-1 pl-2  rounded-xl">
                      <p className="font-bold text-green-700">{mensajeValidacion}</p>
                    </div>
                  )}
                </div>

                {licenciaValidada && (
                  <div>
                    <label className="block text-sm font-bold text-dark mb-2">
                      Seleccionar Flota *
                    </label>
                    <select
                      name="flota"
                      value={formData.flota}
                      onChange={manejarCambio}
                      disabled={cargandoFlotas || !sistemaActivo}
                      className={`w-full px-4 py-3 text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer bg-white ${
                        errores.flota ? 'border-red-500' : 'border-dark'
                      } ${(cargandoFlotas || !sistemaActivo) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231A1A1A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1.5rem'
                      }}
                    >
                      <option value="">
                        {cargandoFlotas ? 'Cargando tus flotas...' : 'Selecciona tu flota'}
                      </option>
                      {flotas.map((flota) => (
                        <option key={flota.id} value={flota.id}>
                          {flota.name}
                        </option>
                      ))}
                    </select>
                    {errores.flota && (
                      <p className="mt-2 text-sm text-red-500 font-medium">
                        {errores.flota}
                      </p>
                    )}
                  </div>
                )}

                <div className="pt-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        name="terminosAceptados"
                        checked={formData.terminosAceptados}
                        onChange={manejarCambio}
                        disabled={!sistemaActivo}
                        className="w-5 h-5 border-2 border-dark rounded focus:ring-2 focus:ring-primary/50 cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ accentColor: '#FF0000' }}
                      />
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">
                      Acepto los{' '}
                      <button 
                        type="button"
                        onClick={() => setMostrarTerminos(true)}
                        className="text-primary font-bold hover:underline"
                      >
                        términos y condiciones
                      </button>
                    </span>
                  </label>
                  {errores.terminosAceptados && (
                    <p className="mt-2 text-sm text-red-500 font-medium ml-8">
                      {errores.terminosAceptados}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={enviando || !licenciaValidada || !formData.flota || !formData.terminosAceptados || !sistemaActivo}
                  className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl transition-all duration-300 hover:bg-primary-dark hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-primary"
                >
                  {enviando ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    'Enviar Registro'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
        </div>
      </div>
      
      <ModalTerminos 
        mostrar={mostrarTerminos} 
        onCerrar={() => setMostrarTerminos(false)}
        onAceptar={() => {
          setFormData(prev => ({ ...prev, terminosAceptados: true }))
          setMostrarTerminos(false)
          if (errores.terminosAceptados) {
            setErrores(prev => ({ ...prev, terminosAceptados: '' }))
          }
        }}
      />

      {/* Modal de Redirección */}
      {mostrarModalRedireccion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-dark mb-3">
                Licencia No Encontrada
              </h2>
              <p className="text-gray-600 mb-4">
                Tu licencia no está registrada en nuestro sistema. 
                Te redirigiremos a nuestra página oficial para que puedas registrarte.
              </p>
            </div>
            
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <p className="text-lg font-bold text-primary">
                Serás redirigido en {contadorRedireccion} segundos
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={redirigirAhora}
                className="flex-1 px-4 py-3 rounded-xl font-bold transition-all bg-primary text-white hover:bg-primary-dark"
              >
                Ir Ahora
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
