"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Algo salió mal
      </h1>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Ocurrió un error inesperado. Puedes intentar de nuevo o volver al
        inicio.
      </p>
      <button
        onClick={reset}
        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
