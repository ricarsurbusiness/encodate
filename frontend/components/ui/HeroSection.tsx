"use client";

import { Search, X } from "lucide-react";

interface HeroSectionProps {
  value: string;
  onChange: (query: string) => void;
}

export const HeroSection = ({ value, onChange }: HeroSectionProps) => {
  return (
    <div className="flex flex-col py-20 px-4 bg-gray-50 text-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Encuentra y reserva en los mejores</h1>
        <h1 className="text-4xl text-blue-700 font-bold mb-4">
           negocios locales
        </h1>
        <h3 className="text-xl text-gray-600 mb-4 pt-3 pb-2">
          Descubre los mejores negocios locales cerca de ti
        </h3>
      </div>
     {/* Search Bar */}
      <div className="flex justify-center">
        <div className="flex items-center bg-white shadow-md rounded-full px-4 py-2 w-full max-w-xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition">
          
          <Search className="text-gray-400 mr-2" size={20} />

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Buscar negocios..."
            className="flex-1 outline-none bg-transparent"
          />

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-gray-400 hover:text-gray-600 mr-2 transition"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
