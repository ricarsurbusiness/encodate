"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { ServiceForm } from "./ServiceForm";
import type { CreateServicePayload } from "@/types/service";
import type { Service } from "@/types/service";
import { useCreateService, useUpdateService } from "@/hooks/useServices";

interface ServiceFormModalProps {
  open: boolean;
  onClose: () => void;
  businessId: string;
  service?: Service | null;
}

export function ServiceFormModal({
  open,
  onClose,
  businessId,
  service,
}: ServiceFormModalProps) {
  const isEdit = !!service;
  const createMutation = useCreateService(businessId);
  const updateMutation = useUpdateService();
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setServerError(null);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (data: CreateServicePayload) => {
    setServerError(null);
    try {
      if (isEdit && service) {
        await updateMutation.mutateAsync({ id: service.id, ...data });
        toast.success("Servicio actualizado exitosamente");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Servicio creado exitosamente");
      }
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string | string[] } } };
      const message =
        axiosErr?.response?.data?.message || "Error al guardar el servicio";
      setServerError(typeof message === "string" ? message : message[0]);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {isEdit ? "Editar Servicio" : "Nuevo Servicio"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ServiceForm
          defaultValues={
            service
              ? {
                  name: service.name,
                  description: service.description ?? "",
                  duration: service.duration,
                  price: service.price,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          serverError={serverError}
          submitLabel={isEdit ? "Guardar Cambios" : "Crear Servicio"}
        />
      </div>
    </div>
  );
}
