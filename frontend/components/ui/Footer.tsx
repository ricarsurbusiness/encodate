import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto mb-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Logo & About */}
          <div className="text-center sm:text-left">
            <div className="mb-4 -mt-2.5">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Image
                  src="/logoEncodate.png"
                  alt="Encodate Logo"
                  width={40}
                  height={40}
                  priority
                />
                <h4 className="font-semibold text-white text-lg">Encodate</h4>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
              La forma más fácil de encontrar y reservar citas con negocios
              locales. Busca y reserva en segundos.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-gray-200">Producto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-gray-200">Empresa</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Nosotros</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Soporte</a></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-gray-200">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accesibilidad</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Encodate. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
