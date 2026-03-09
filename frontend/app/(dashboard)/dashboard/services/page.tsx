"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useMyBusinesses } from "@/hooks/useBusinesses";
import { useBusinessServices, useDeleteService } from "@/hooks/useServices";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ServiceFormModal } from "@/components/ui/ServiceFormModal";
import type { Service } from "@/types/service";

export default function DashboardServicesPage() {
  const { data: businesses, isLoading: loadingBusinesses } = useMyBusinesses();
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const deleteMutation = useDeleteService();

  const activeBusinessId = selectedBusinessId || businesses?.[0]?.id || "";

  const { data: servicesData, isLoading: loadingServices } =
    useBusinessServices(activeBusinessId, { limit: 50 });

  const handleDelete = async (serviceId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este servicio?")) return;
    try {
      await deleteMutation.mutateAsync(serviceId);
      toast.success("Servicio eliminado exitosamente");
    } catch {
      toast.error("Error al eliminar el servicio");
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingService(null);
  };

  if (loadingBusinesses) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!businesses?.length) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-2">
          Primero necesitas crear un negocio.
        </p>
        <a
          href="/businesses/create"
          className="text-blue-600 hover:underline font-medium"
        >
          Crear negocio →
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Servicios</h1>
          <p className="text-gray-500 mt-1">
            Administra los servicios de tus negocios
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={!activeBusinessId}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-medium text-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Nuevo Servicio
        </button>
      </div>

      {/* Business selector */}
      {businesses.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Negocio
          </label>
          <select
            value={activeBusinessId}
            onChange={(e) => setSelectedBusinessId(e.target.value)}
            className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loadingServices ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : !servicesData?.data?.length ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Este negocio aún no tiene servicios.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servicesData.data.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ServiceFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        businessId={activeBusinessId}
        service={editingService}
      />
    </div>
  );
}
