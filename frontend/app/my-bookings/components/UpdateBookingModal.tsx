"use client";

import { useState } from "react";
import { useUpdateBooking } from "@/hooks/useBookings";
import { toast } from "sonner";
import type { Booking } from "@/types/booking";

interface Props {
  booking: Booking;
  onClose: () => void;
}

export default function UpdateBookingModal({ booking, onClose }: Props) {
  const [notes, setNotes] = useState(booking.notes || "");
  const [startTime, setStartTime] = useState(
    new Date(booking.startTime).toISOString().slice(0, 16),
  );
  const { mutate, isPending } = useUpdateBooking(booking.id);

  const handleUpdate = () => {
    mutate(
      { startTime, notes },
      {
        onSuccess: () => {
          toast.success("Reserva actualizada exitosamente");
          onClose();
        },
        onError: (error) => {
          const message =
            (error.response?.data as { message?: string })?.message ||
            "Error al actualizar la reserva";
          toast.error(message);
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Editar reserva</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Fecha & Hora</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Notas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="text-gray-500 text-sm">
            Cancelar
          </button>

          <button
            onClick={handleUpdate}
            disabled={isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
