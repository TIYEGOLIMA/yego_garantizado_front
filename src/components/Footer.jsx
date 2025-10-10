export default function Footer() {
  return (
    <footer className="bg-dark text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <img src="/yego.png" alt="YEGO" className="h-8 mb-4" />
            <p className="text-white leading-relaxed">
              La comunidad de conductores Yango más grande de Latinoamérica. 
              <span className="block mt-1">Soporte 24/7 y beneficios exclusivos para ti.</span>
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-primary">Enlaces</h4>
            <ul className="space-y-2 text-white">
              <li><a href="#" className="hover:text-primary transition-colors">Términos y Condiciones</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-primary">Contáctanos</h4>
            <ul className="space-y-2 text-white">
              <li>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Av.+Prolongación+Iquitos+2299,+Lince" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Av. Prolongación Iquitos 2299, Lince
                </a>
              </li>
              <li>
                <a 
                  href="tel:+51905459777" 
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  +51 905 459 777
                </a>
              </li>
              <li>
                <a 
                  href="mailto:sac@yego.pro" 
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  sac@yego.pro
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center space-y-2">
          <p className="text-primary font-bold text-lg">#YegoSiempreCumple ❤️</p>
          <p className="text-gray-500 text-sm">© 2025 Yego. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
