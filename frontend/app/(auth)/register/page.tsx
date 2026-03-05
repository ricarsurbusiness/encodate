"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { AxiosError } from "axios";
import api from "@/lib/axios";

// ─── Zod schema ──────────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("Ingresa un email válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ─── Component ───────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (formData: RegisterFormData) => {
    setServerError("");

    try {
      // Strip confirmPassword before sending
      const { confirmPassword: _, ...payload } = formData;
      await api.post("/auth/register", payload);
      router.push("/login?registered=true");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          setServerError("Este email ya está registrado.");
        } else {
          setServerError(
            err.response?.data?.message || "No se pudo completar el registro.",
          );
        }
      } else {
        setServerError("No se pudo conectar con el servidor.");
      }
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name" className="text-sm text-gray-600">Nombre</label>
        <input
          id="name"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          type="text"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="reg-email" className="text-sm text-gray-600">Email</label>
        <input
          id="reg-email"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          type="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="reg-password" className="text-sm text-gray-600">Contraseña</label>
        <input
          id="reg-password"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="text-sm text-gray-600">Confirmar contraseña</label>
        <input
          id="confirmPassword"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="text-sm text-gray-600">Teléfono (opcional)</label>
        <input
          id="phone"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          type="tel"
          {...register("phone")}
        />
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
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
