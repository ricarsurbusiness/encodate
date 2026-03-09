"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CreateBusinessPayload } from "@/types/business";

const businessFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

interface BusinessFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<BusinessFormValues>;
  onSubmit: (data: CreateBusinessPayload) => void;
  isSubmitting?: boolean;
  serverError?: string | null;
}

export function BusinessForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting,
  serverError,
}: BusinessFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      address: defaultValues?.address ?? "",
      phone: defaultValues?.phone ?? "",
    },
  });

  const handleFormSubmit = (data: BusinessFormValues) => {
    const payload: CreateBusinessPayload = {
      name: data.name,
      ...(data.description && { description: data.description }),
      ...(data.address && { address: data.address }),
      ...(data.phone && { phone: data.phone }),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {serverError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {serverError}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nombre *
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Nombre del negocio"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Descripción
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe tu negocio"
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Dirección
        </label>
        <input
          id="address"
          type="text"
          {...register("address")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Dirección del negocio"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Teléfono
        </label>
        <input
          id="phone"
          type="text"
          {...register("phone")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Teléfono de contacto"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isSubmitting
          ? "Guardando..."
          : mode === "create"
            ? "Crear Negocio"
            : "Guardar Cambios"}
      </button>
    </form>
  );
}
