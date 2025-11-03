import { useState, useRef, useEffect } from 'react'

export default function ModalTerminos({ mostrar, onCerrar, onAceptar }) {
  const [puedesCerrar, setPuedesCerrar] = useState(false)
  const contenidoRef = useRef(null)
  const fondoRef = useRef(null)
  const contenedorRef = useRef(null)

  useEffect(() => {
    if (mostrar) {
      setPuedesCerrar(false)
    }
  }, [mostrar])

  useEffect(() => {
    if (!mostrar) return
    const anteriorOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = anteriorOverflow
    }
  }, [mostrar])

  useEffect(() => {
    if (!mostrar) return
    const enfocarInicial = () => {
      if (!contenedorRef.current) return
      const elementos = contenedorRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (elementos.length > 0) {
        const primero = elementos[0]
        if (primero && typeof primero.focus === 'function') primero.focus()
      }
    }
    enfocarInicial()
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

  const manejarTecla = (e) => {
    if (e.key === 'Escape') {
      onCerrar && onCerrar()
      return
    }
    if (e.key !== 'Tab') return
    if (!contenedorRef.current) return
    const elementos = contenedorRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (elementos.length === 0) return
    const foco = document.activeElement
    const primero = elementos[0]
    const ultimo = elementos[elementos.length - 1]
    if (e.shiftKey) {
      if (foco === primero || !contenedorRef.current.contains(foco)) {
        e.preventDefault()
        ultimo.focus()
      }
    } else {
      if (foco === ultimo || !contenedorRef.current.contains(foco)) {
        e.preventDefault()
        primero.focus()
      }
    }
  }

  const manejarClicFondo = (e) => {
    if (e.target === fondoRef.current) {
      onCerrar && onCerrar()
    }
  }

  if (!mostrar) return null

  return (
    <div
      ref={fondoRef}
      onMouseDown={manejarClicFondo}
      onKeyDown={manejarTecla}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-terminos"
      tabIndex={-1}
    >
      <div ref={contenedorRef} className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col">
        <div className="sticky top-0 z-10 p-6 border-b border-gray-200 flex items-center justify-start bg-white/95 backdrop-blur">
          <h2 id="titulo-terminos" className="text-2xl font-bold text-dark">Términos y Condiciones</h2>
        </div>
        
        <div 
          ref={contenidoRef}
          onScroll={manejarScroll}
          className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-700"
        >
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-sm text-dark font-semibold">
              Lee cuidadosamente. Debes cumplir estos puntos para acceder al garantizado.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h3 className="text-xl font-bold text-dark mb-3">Condiciones del garantizado</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <p className="text-gray-800">Cumplir la cantidad mínima de horas de conexión a la semana según el cuadro detallado.</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <p className="text-gray-800">Registrarte antes de realizar tu primer viaje de la semana.</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <p className="text-gray-800">No realizar viajes fraudulentos (se revisarán los viajes).</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <p className="text-gray-800">El garantizado solo aplica a viajes realizados entre el 20 y 26 de octubre. Si no cumples las horas mínimas, no accedes al beneficio.</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <p className="text-gray-800">Puedes consultar tus horas por WhatsApp al +51 905 459 777.</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <p className="text-gray-800">Al recibir el pago, autorizas la grabación de un breve testimonio en video.</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <p className="text-gray-800">Promoción personal e intransferible.</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <p className="text-gray-800">Vigente solo para conductores activos de Yango bajo Yego.</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <p className="text-gray-800">Una vez finalizada la semana, los conductores tendrán un plazo máximo de 10 días para realizar reclamo de premio o cualquier observación y/o reclamo.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-dark">Cuadro de horas mínimas y viajes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <p className="text-center font-bold text-dark">SIN BRANDEO · LIMA</p>
                <div className="mt-3 grid grid-cols-2 text-sm">
                  <div className="font-semibold text-gray-600 text-center">Viajes</div>
                  <div className="font-semibold text-gray-600 text-center">Hrs. Mínimas Requeridas</div>
                  <div className="text-center">60</div><div className="text-center">20</div>
                  <div className="text-center">80</div><div className="text-center">30</div>
                  <div className="text-center">100</div><div className="text-center">42</div>
                  <div className="text-center">120</div><div className="text-center">50</div>
                  <div className="text-center">145</div><div className="text-center">60</div>
                </div>
              </div>
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <p className="text-center font-bold text-dark">CON BRANDEO · LIMA</p>
                <div className="mt-3 grid grid-cols-2 text-sm">
                  <div className="font-semibold text-gray-600 text-center">Viajes</div>
                  <div className="font-semibold text-gray-600 text-center">Hrs. Mínimas Requeridas</div>
                  <div className="text-center">80</div><div className="text-center">30</div>
                  <div className="text-center">100</div><div className="text-center">42</div>
                  <div className="text-center">120</div><div className="text-center">50</div>
                  <div className="text-center">145</div><div className="text-center">60</div>
                  <div className="text-center">180</div><div className="text-center">75</div>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <p className="text-center font-bold text-dark">SIN BRANDEO · AREQUIPA</p>
                <div className="mt-3 grid grid-cols-2 text-sm">
                  <div className="font-semibold text-gray-600 text-center">Viajes</div>
                  <div className="font-semibold text-gray-600 text-center">Hrs. Mínimas Requeridas</div>
                  <div className="text-center">65</div><div className="text-center">30</div>
                  <div className="text-center">95</div><div className="text-center">40</div>
                  <div className="text-center">125</div><div className="text-center">50</div>
                  <div className="text-center">155</div><div className="text-center">60</div>
                  <div className="text-center">195</div><div className="text-center">72</div>
                </div>
              </div>
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <p className="text-center font-bold text-dark">CON BRANDEO · AREQUIPA</p>
                <div className="mt-3 grid grid-cols-2 text-sm">
                  <div className="font-semibold text-gray-600 text-center">Viajes</div>
                  <div className="font-semibold text-gray-600 text-center">Hrs. Mínimas Requeridas</div>
                  <div className="text-center">65</div><div className="text-center">30</div>
                  <div className="text-center">95</div><div className="text-center">40</div>
                  <div className="text-center">125</div><div className="text-center">50</div>
                  <div className="text-center">155</div><div className="text-center">60</div>
                  <div className="text-center">205</div><div className="text-center">76</div>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <p className="text-center font-bold text-dark">SIN BRANDEO · TRUJILLO</p>
                <div className="mt-3 grid grid-cols-2 text-sm">
                  <div className="font-semibold text-gray-600 text-center">Viajes</div>
                  <div className="font-semibold text-gray-600 text-center">Hrs. Mínimas Requeridas</div>
                  <div className="text-center">50</div><div className="text-center">20</div>
                  <div className="text-center">75</div><div className="text-center">30</div>
                  <div className="text-center">105</div><div className="text-center">40</div>
                  <div className="text-center">125</div><div className="text-center">50</div>
                  <div className="text-center">155</div><div className="text-center">60</div>
                </div>
              </div>
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <p className="text-center font-bold text-dark">CON BRANDEO · TRUJILLO</p>
                <div className="mt-3 grid grid-cols-2 text-sm">
                  <div className="font-semibold text-gray-600 text-center">Viajes</div>
                  <div className="font-semibold text-gray-600 text-center">Hrs. Mínimas Requeridas</div>
                  <div className="text-center">75</div><div className="text-center">30</div>
                  <div className="text-center">100</div><div className="text-center">40</div>
                  <div className="text-center">125</div><div className="text-center">50</div>
                  <div className="text-center">155</div><div className="text-center">60</div>
                  <div className="text-center">190</div><div className="text-center">71</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <p className="text-sm text-dark font-semibold">
              {puedesCerrar 
                ? "✓ Has leído todos los términos y condiciones. Ahora puedes aceptar." 
                : "⬇ Por favor, desplázate hasta el final para poder aceptar."}
            </p>
          </div>
        </div>
        
        <div className="sticky bottom-0 z-10 p-6 border-t border-gray-200 flex justify-end gap-3 bg-white/95 backdrop-blur">
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

