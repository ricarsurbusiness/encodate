import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <SearchX className="w-12 h-12 text-gray-400 mb-4" />
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-500 mb-6">
        No se encontró la página que buscas
      </p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
