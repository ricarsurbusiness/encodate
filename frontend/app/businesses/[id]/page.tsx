"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useBusiness } from "@/hooks/useBusinesses";
import { useCreateBooking } from "@/hooks/useBookings";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Loader2, MapPin, Phone, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { Service } from "@/types/service";

function BusinessDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { data: business, isLoading, error } = useBusiness(id);
  const createBooking = useCreateBooking();

  const serviceFromQuery = searchParams.get("service");

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (serviceFromQuery && isAuthenticated && business?.services?.length) {
      const service = business.services.find((s) => s.id === serviceFromQuery);
      if (service) {
        setSelectedService(service);
        router.replace(`/businesses/${id}`);
      }
    }
  }, [serviceFromQuery, isAuthenticated, business?.services, router, id]);

  const handleBook = (serviceId: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/businesses/${id}?service=${serviceId}`);
      return;
    }
    const service = business?.services?.find((s) => s.id === serviceId);
    if (service) setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setDate("");
    setTime("");
    setNotes("");
  };

  const handleConfirmBooking = () => {
    if (!date || !time) {
      toast.error("Selecciona fecha y hora");
      return;
    }
    const selectedDateTime = new Date(`${date}T${time}`);
    if (selectedDateTime <= new Date()) {
      toast.error("Selecciona una hora futura");
      return;
    }

    createBooking.mutate(
      {
        serviceId: selectedService!.id,
        startTime: selectedDateTime.toISOString(),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      },
      {
        onSuccess: () => {
          toast.success("Reserva creada exitosamente");
          router.replace("/my-bookings");
        },
        onError: () => {
          toast.error("Error al crear la reserva");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Negocio no encontrado</p>
        <button
          onClick={() => router.push("/businesses")}
          className="mt-4 text-blue-600 hover:underline"
        >
          Volver a negocios
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
        {/* Back to home */}
  <button
    onClick={() => router.push("/")}
    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition mb-6"
  >
    <ArrowLeft className="w-4 h-4" />
    Volver al inicio
  </button>
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-3xl p-10 mb-12 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{business.name}</h1>
        {business.description && (
          <p className="text-lg text-slate-200 mb-2">{business.description}</p>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
          {business.address && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {business.address}
            </span>
          )}
          {business.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" /> {business.phone}
            </span>
          )}
        </div>
      </div>

      {/* Services */}
      <h2 className="text-2xl font-semibold mb-6">Servicios</h2>

      {business.services?.length === 0 ? (
        <p className="text-gray-500">Este negocio aún no tiene servicios.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {business.services?.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onBook={handleBook}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">
              Reservar: {selectedService.name}
            </h3>

            <div className="flex flex-col gap-4">
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="border rounded-xl px-3 py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <input
                type="time"
                className="border rounded-xl px-3 py-2"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <textarea
                placeholder="Notas (opcional)"
                className="border rounded-xl px-3 py-2"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button
                disabled={createBooking.isPending}
                onClick={handleConfirmBooking}
                className="bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createBooking.isPending ? "Reservando..." : "Confirmar Reserva"}
              </button>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BusinessDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <BusinessDetailContent />
    </Suspense>
  );
}
