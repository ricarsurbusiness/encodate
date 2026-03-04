"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useCreateBusiness } from "@/hooks/useBusinesses";
import { BusinessForm } from "@/components/ui/BusinessForm";
import { useAuth } from "@/context/AuthContext";
import { RoleGate } from "@/components/auth/RoleGate";
import { Role } from "@/types/auth";
import type { CreateBusinessPayload } from "@/types/business";

export default function CreateBusinessPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const createMutation = useCreateBusiness();
  const [serverError, setServerError] = useState<string | null>(null);

  if (loading) return null;
  if (!isAuthenticated) {
    router.push("/login?redirect=/businesses/create");
    return null;
  }

  const handleSubmit = async (data: CreateBusinessPayload) => {
    setServerError(null);
    try {
      await createMutation.mutateAsync(data);
      toast.success("Negocio creado exitosamente");
      router.push("/dashboard/businesses");
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string | string[] } };
      };
      const message =
        axiosErr?.response?.data?.message || "Error al crear el negocio";
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
          Crear Negocio
        </h1>

        <BusinessForm
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          serverError={serverError}
        />
      </div>
    </RoleGate>
  );
}
