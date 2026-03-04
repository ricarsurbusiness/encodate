"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useMyBusinesses, useDeleteBusiness } from "@/hooks/useBusinesses";
import { useBusinessServices, useDeleteService } from "@/hooks/useServices";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ServiceFormModal } from "@/components/ui/ServiceFormModal";
import type { Business } from "@/types/business";
import type { Service } from "@/types/service";

function BusinessServicesPanel({ business }: { business: Business }) {
  const { data: servicesData, isLoading } = useBusinessServices(business.id, {
    limit: 50,
  });
  const deleteMutation = useDeleteService();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleDeleteService = async (serviceId: string) => {
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

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">Servicios</h4>
        <button
          onClick={handleCreate}
          className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-3 h-3" /> Agregar
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        </div>
      ) : !servicesData?.data?.length ? (
        <p className="text-sm text-gray-400 text-center py-4">
          Este negocio aún no tiene servicios.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {servicesData.data.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={handleEdit}
              onDelete={handleDeleteService}
            />
          ))}
        </div>
      )}

      <ServiceFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        businessId={business.id}
        service={editingService}
      />
    </div>
  );
}

export default function DashboardBusinessesPage() {
  const { data: businesses, isLoading } = useMyBusinesses();
  const deleteMutation = useDeleteBusiness();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este negocio?")) return;
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Negocio eliminado exitosamente");
      if (expandedId === id) setExpandedId(null);
    } catch {
      toast.error("Error al eliminar el negocio");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Negocios</h1>
          <p className="text-gray-500 mt-1">
            Administra tus negocios y servicios
          </p>
        </div>
        <Link
          href="/businesses/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo Negocio
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : !businesses?.length ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">
            Aún no tienes negocios registrados.
          </p>
          <Link
            href="/businesses/create"
            className="text-blue-600 hover:underline font-medium"
          >
            Crear tu primer negocio →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {business.name}
                  </h2>
                  {business.description && (
                    <p className="text-gray-600 mt-1 text-sm">
                      {business.description}
                    </p>
                  )}
                  <div className="mt-2 space-y-1">
                    {business.address && (
                      <p className="text-sm text-gray-500">
                        📍 {business.address}
                      </p>
                    )}
                    {business.phone && (
                      <p className="text-sm text-gray-500">
                        📞 {business.phone}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleExpand(business.id)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium ml-4 mt-1"
                >
                  Servicios
                  {expandedId === business.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Owner actions */}
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/businesses/${business.id}/edit`}
                  className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(business.id)}
                  disabled={deletingId === business.id}
                  className="text-sm px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                >
                  {deletingId === business.id ? "Eliminando..." : "Eliminar"}
                </button>
              </div>

              {/* Expandable services panel */}
              {expandedId === business.id && (
                <BusinessServicesPanel business={business} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
