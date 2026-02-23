import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-4">

             <div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-40">
        
        {/* Logo + descripción */}
        <div>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            La forma más fácil de encontrar y reservar citas con negocios locales.
            Busca y reserva en segundos, sin llamadas ni esperas. ¡Únete y ahorra tiempo!
          </p>
          <div className="flex gap-3">
            {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>



        {/* Company */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            {["About Us", "Careers", "Blog", "Press", "Contact"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Stay Updated</h4>
          <p className="text-sm text-gray-500 mb-4">
            Subscribe to our newsletter for the latest updates and offers.
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 transition-colors"
            />
            <button className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
        </div>
     
      <div className="border-t border-gray-100 text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Encodate. All rights reserved.
      </div>
    </footer>
  );
};