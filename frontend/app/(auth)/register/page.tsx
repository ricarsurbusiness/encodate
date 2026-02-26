"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!response.ok) {
        throw new Error("Error en el registro");
      }

      router.push("/login");
    } catch (err) {
      setError("No se pudo completar el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm text-gray-600">Nombre</label>
        <input
          className="border rounded-lg px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Email</label>
        <input
          className="border rounded-lg px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Contraseña</label>
        <input
          className="border rounded-lg px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Confirmar contraseña</label>
        <input
          className="border rounded-lg px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          type="password"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Teléfono (opcional)</label>
        <input
          className="border rounded-lg px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-2 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <div className="text-center text-sm text-gray-500 mt-2">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-blue-600 hover:underline font-medium"
        >
          Inicia sesión
        </Link>
      </div>
    </form>
  );
}
