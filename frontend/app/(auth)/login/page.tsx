"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Suspense, useState } from "react";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import type { AuthResponse } from "@/types/auth";

// ─── Zod schema ──────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Ingresa un email válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ─── Page wrapper (Suspense boundary for useSearchParams) ────────────────────
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

// ─── Inner form component ────────────────────────────────────────────────────
function LoginForm() {
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const registered = searchParams.get("registered");
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: LoginFormData) => {
    setServerError("");

    try {
      const { data } = await api.post<AuthResponse>("/auth/login", formData);
      login(data.user, data.accessToken, data.refreshToken);
      router.push(redirect || "/");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          setServerError("Email o contraseña incorrectos");
        } else if (err.response?.status === 429) {
          setServerError("Demasiados intentos. Intenta de nuevo más tarde.");
        } else {
          setServerError("Error del servidor. Intenta de nuevo.");
        }
      } else {
        setServerError("No se pudo conectar con el servidor.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {registered && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg">
          ¡Cuenta creada exitosamente! Inicia sesión.
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="text-sm text-gray-600">Email</label>
          <input
            id="email"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="text-sm text-gray-600">Contraseña</label>
          <input
            id="password"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-2 rounded-lg">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>

      <div className="text-center text-sm text-gray-500">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="text-blue-600 hover:underline font-medium"
        >
          Regístrate
        </Link>
      </div>
    </div>
  );
}
