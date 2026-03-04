"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CreateServicePayload } from "@/types/service";

export const serviceFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional().or(z.literal("")),
  duration: z
    .number()
    .int()
    .min(1, "Mínimo 1 minuto")
    .max(240, "Máximo 240 minutos"),
  price: z.number().min(0, "El precio no puede ser negativo"),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  defaultValues?: Partial<ServiceFormValues>;
  onSubmit: (data: CreateServicePayload) => void;
  isSubmitting?: boolean;
  serverError?: string | null;
  submitLabel?: string;
}

export function ServiceForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  serverError,
  submitLabel = "Guardar",
}: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      duration: defaultValues?.duration ?? 30,
      price: defaultValues?.price ?? 0,
    },
  });

  const handleFormSubmit = (data: ServiceFormValues) => {
    const payload: CreateServicePayload = {
      name: data.name,
      duration: data.duration,
      price: data.price,
      ...(data.description && { description: data.description }),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {serverError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {serverError}
        </div>
      )}

      <div>
        <label
          htmlFor="svc-name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nombre *
        </label>
        <input
          id="svc-name"
          type="text"
          {...register("name")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nombre del servicio"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="svc-description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Descripción
        </label>
        <textarea
          id="svc-description"
          {...register("description")}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe el servicio"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="svc-duration"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Duración (min) *
          </label>
          <input
            id="svc-duration"
            type="number"
            {...register("duration", { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="30"
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">
              {errors.duration.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="svc-price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Precio *
          </label>
          <input
            id="svc-price"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">
              {errors.price.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isSubmitting ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
