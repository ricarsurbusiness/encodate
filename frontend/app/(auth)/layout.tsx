import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Volver al inicio
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Encodate
          </h1>
          <p className="text-gray-500 mt-2">Sistema moderno de reservas</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">{children}</div>
      </div>
    </div>
  );
}
