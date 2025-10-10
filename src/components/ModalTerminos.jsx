import { useState, useRef, useEffect } from 'react'

export default function ModalTerminos({ mostrar, onCerrar, onAceptar }) {
  const [puedesCerrar, setPuedesCerrar] = useState(false)
  const contenidoRef = useRef(null)

  useEffect(() => {
    if (mostrar) {
      setPuedesCerrar(false)
    }
  }, [mostrar])

  const manejarScroll = () => {
    if (contenidoRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contenidoRef.current
      const arribaDelFondo = scrollHeight - scrollTop - clientHeight < 50
      
      if (arribaDelFondo && !puedesCerrar) {
        setPuedesCerrar(true)
      }
    }
  }

  if (!mostrar) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark">Términos y Condiciones</h2>
          <div className="w-8"></div>
        </div>
        
        <div 
          ref={contenidoRef}
          onScroll={manejarScroll}
          className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700"
        >
          <h3 className="text-xl font-bold text-dark">1. Aceptación de los Términos</h3>
          <p>
            Al registrarte como conductor en la plataforma Yego, aceptas estos términos y condiciones en su totalidad. 
            Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestros servicios.
          </p>

          <h3 className="text-xl font-bold text-dark mt-6">2. Requisitos del Conductor</h3>
          <p>Para ser conductor de Yego debes cumplir con los siguientes requisitos:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Ser mayor de 18 años</li>
            <li>Poseer licencia de conducir vigente y válida</li>
            <li>Contar con vehículo propio o autorizado</li>
            <li>Aprobar verificación de antecedentes</li>
            <li>Completar el proceso de capacitación</li>
          </ul>

          <h3 className="text-xl font-bold text-dark mt-6">3. Uso de la Plataforma</h3>
          <p>
            Como conductor, te comprometes a utilizar la plataforma de manera responsable y profesional. 
            Debes mantener un alto estándar de servicio al cliente y seguir todas las normas de tránsito aplicables.
          </p>

          <h3 className="text-xl font-bold text-dark mt-6">4. Garantizado y Pagos</h3>
          <p>
            El sistema de garantizado está sujeto a cumplimiento de metas y condiciones específicas. 
            Los pagos se realizarán según el calendario establecido y las tarifas acordadas.
          </p>

          <h3 className="text-xl font-bold text-dark mt-6">5. Responsabilidades del Conductor</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Mantener el vehículo en óptimas condiciones</li>
            <li>Cumplir con todas las regulaciones de tránsito</li>
            <li>Tratar a los pasajeros con respeto y profesionalismo</li>
            <li>Mantener vigente toda la documentación requerida</li>
            <li>Reportar cualquier incidente de manera inmediata</li>
          </ul>

          <h3 className="text-xl font-bold text-dark mt-6">6. Cancelación y Suspensión</h3>
          <p>
            Yego se reserva el derecho de suspender o cancelar tu cuenta en caso de incumplimiento de estos términos, 
            comportamiento inapropiado, o violación de las políticas de la plataforma.
          </p>

          <h3 className="text-xl font-bold text-dark mt-6">7. Protección de Datos</h3>
          <p>
            Tus datos personales serán tratados de acuerdo con nuestra Política de Privacidad. 
            Nos comprometemos a proteger tu información y utilizarla únicamente para los fines establecidos.
          </p>

          <h3 className="text-xl font-bold text-dark mt-6">8. Modificaciones</h3>
          <p>
            Yego se reserva el derecho de modificar estos términos en cualquier momento. 
            Te notificaremos sobre cambios significativos y tu uso continuado constituirá aceptación de los nuevos términos.
          </p>

          <h3 className="text-xl font-bold text-dark mt-6">9. Contacto</h3>
          <p>
            Para consultas sobre estos términos, puedes contactarnos en sac@yego.pro o al +51 905 459 777.
          </p>

          <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <p className="text-sm text-dark font-semibold">
              {puedesCerrar 
                ? "✓ Has leído todos los términos y condiciones. Ahora puedes aceptar." 
                : "⬇ Por favor, desplázate hasta el final para poder aceptar."}
            </p>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onCerrar}
            className="px-6 py-3 rounded-xl font-bold transition-all bg-gray-200 text-dark hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onAceptar}
            disabled={!puedesCerrar}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              puedesCerrar
                ? 'bg-primary text-white hover:bg-primary-dark cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {puedesCerrar ? 'Aceptar' : 'Lee hasta el final'}
          </button>
        </div>
      </div>
    </div>
  )
}

