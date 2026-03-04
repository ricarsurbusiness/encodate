"use client";

import { useState } from "react";
import { Loader2, Check, X, CheckCircle2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useMyBusinesses } from "@/hooks/useBusinesses";
import {
  useBusinessBookings,
  useChangeBookingStatus,
} from "@/hooks/useBookings";
import BookingStatusBadge from "@/app/my-bookings/components/BookingStatusBadge";
import type { Booking, BookingStatus, BookingFilters } from "@/types/booking";

// ── Status action buttons for owner ──────────────────────────────

function StatusActions({ booking }: { booking: Booking }) {
  const changeStatus = useChangeBookingStatus();
  const [acting, setActing] = useState(false);

  const handleChange = async (status: BookingStatus) => {
    setActing(true);
    try {
      await changeStatus.mutateAsync({ bookingId: booking.id, status });
      const labels: Record<BookingStatus, string> = {
        CONFIRMED: "Reserva confirmada",
        CANCELLED: "Reserva cancelada",
        COMPLETED: "Reserva marcada como completada",
        PENDING: "Reserva pendiente",
      };
      toast.success(labels[status]);
    } catch {
      toast.error("Error al cambiar el estado");
    } finally {
      setActing(false);
    }
  };

  if (acting) {
    return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
  }

  switch (booking.status) {
    case "PENDING":
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleChange("CONFIRMED")}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition font-medium"
          >
            <Check className="w-3.5 h-3.5" /> Confirmar
          </button>
          <button
            onClick={() => handleChange("CANCELLED")}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-medium"
          >
            <X className="w-3.5 h-3.5" /> Rechazar
          </button>
        </div>
      );
    case "CONFIRMED":
      return (
        <button
          onClick={() => handleChange("COMPLETED")}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition font-medium"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Completar
        </button>
      );
    default:
      return null;
  }
}

// ── Booking row in owner table ───────────────────────────────────

function BookingRow({ booking }: { booking: Booking }) {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const fmt = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition">
      <td className="py-3 px-4">
        <p className="font-medium text-gray-900">{booking.user.name}</p>
        <p className="text-xs text-gray-500">{booking.user.email}</p>
      </td>
      <td className="py-3 px-4 text-sm text-gray-700">
        {booking.service.name}
      </td>
      <td className="py-3 px-4 text-sm text-gray-700">
        <p>{start.toLocaleDateString()}</p>
        <p className="text-xs text-gray-500">
          {fmt(start)} – {fmt(end)}
        </p>
      </td>
      <td className="py-3 px-4">
        <BookingStatusBadge status={booking.status} />
      </td>
      <td className="py-3 px-4 text-sm text-gray-500 max-w-[200px] truncate">
        {booking.notes || "—"}
      </td>
      <td className="py-3 px-4">
        <StatusActions booking={booking} />
      </td>
    </tr>
  );
}

// ── Bookings table for a single business ─────────────────────────

function BusinessBookingsTable({ businessId }: { businessId: string }) {
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useBusinessBookings(businessId, filters);

  const handleStatusFilter = (status: BookingStatus | "") => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      status: status || undefined,
    }));
  };

  const handleDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      page: 1,
      [name]: value || undefined,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  const bookings = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filters.status ?? ""}
          onChange={(e) =>
            handleStatusFilter(e.target.value as BookingStatus | "")
          }
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="CONFIRMED">Confirmada</option>
          <option value="CANCELLED">Cancelada</option>
          <option value="COMPLETED">Completada</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={filters.startDate ?? ""}
          onChange={handleDateFilter}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Desde"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate ?? ""}
          onChange={handleDateFilter}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Hasta"
        />

        {(filters.status || filters.startDate || filters.endDate) && (
          <button
            onClick={() => setFilters({ page: 1, limit: 10 })}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Table */}
      {bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No hay reservas para este negocio con los filtros actuales.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Servicio</th>
                  <th className="py-3 px-4">Fecha / Hora</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Notas</th>
                  <th className="py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <span>
                Página {meta.page} de {meta.totalPages} ({meta.total} reservas)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={meta.page <= 1}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: (prev.page ?? 1) - 1,
                    }))
                  }
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ← Anterior
                </button>
                <button
                  disabled={meta.page >= meta.totalPages}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: (prev.page ?? 1) + 1,
                    }))
                  }
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────

export default function DashboardBookingsPage() {
  const { data: businesses, isLoading } = useMyBusinesses();
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");

  // Auto-select first business once loaded
  const resolvedId =
    selectedBusinessId || (businesses?.length ? businesses[0].id : "");

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!businesses?.length) {
    return (
      <div className="text-center py-20">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">
          No tienes negocios registrados. Crea uno primero para ver reservas.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reservas de mis Negocios
          </h1>
          <p className="text-gray-500 mt-1">
            Gestiona las reservas que reciben tus negocios
          </p>
        </div>

        {/* Business selector */}
        {businesses.length > 1 && (
          <select
            value={resolvedId}
            onChange={(e) => setSelectedBusinessId(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {resolvedId && <BusinessBookingsTable businessId={resolvedId} />}
    </div>
  );
}
