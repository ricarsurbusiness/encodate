"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useBusiness, useUpdateBusiness } from "@/hooks/useBusinesses";
import { BusinessForm } from "@/components/ui/BusinessForm";
import { useAuth } from "@/context/AuthContext";
import { RoleGate } from "@/components/auth/RoleGate";
import { Role } from "@/types/auth";
import type { CreateBusinessPayload } from "@/types/business";

export default function EditBusinessPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { data: business, isLoading } = useBusiness(id);
  const updateMutation = useUpdateBusiness(id);
  const [serverError, setServerError] = useState<string | null>(null);

  if (authLoading) return null;
  if (!isAuthenticated) {
    router.push(`/login?redirect=/businesses/${id}/edit`);
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Negocio no encontrado</p>
      </div>
    );
  }

  const handleSubmit = async (data: CreateBusinessPayload) => {
    setServerError(null);
    try {
      await updateMutation.mutateAsync(data);
      toast.success("Negocio actualizado exitosamente");
      router.push("/dashboard/businesses");
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string | string[] } };
      };
      const message =
        axiosErr?.response?.data?.message ||
        "Error al actualizar el negocio";
      setServerError(typeof message === "string" ? message : message[0]);
    }
  };

  return (
    <RoleGate allowed={[Role.ADMIN, Role.STAFF]}>
      <div className="max-w-2xl mx-auto py-10 px-4">
        <Link
          href="/dashboard/businesses"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a mis negocios
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Editar Negocio
        </h1>

        <BusinessForm
          mode="edit"
          defaultValues={{
            name: business.name,
            description: business.description ?? "",
            address: business.address ?? "",
            phone: business.phone ?? "",
          }}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          serverError={serverError}
        />
      </div>
    </RoleGate>
  );
}
