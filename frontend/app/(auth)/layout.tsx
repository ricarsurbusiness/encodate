export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Encodate</h1>
          <p className="text-gray-600 mt-2">Sistema de reservas moderno</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">{children}</div>
      </div>
    </div>
  );
}
