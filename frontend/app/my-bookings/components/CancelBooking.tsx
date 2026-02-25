"use client";
import { useState } from "react";
import api from "@/lib/axios";

interface CancelBookingButtonProps {
  bookingId: string;
  onCancelSuccess: (bookingId: string) => void;
}

export const CancelBookingButton = ({
  bookingId,
  onCancelSuccess,
}: CancelBookingButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    const confirmCancel = confirm("Estas seguro de cancelar esta reserva?");

    if (!confirmCancel) return;

    setLoading(true);

    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      // Notificar al padre para actualización optimista
      onCancelSuccess(bookingId);
    } catch (error) {
      console.error(error);
      alert("Error canceling booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="mt-3 text-red-500 hover:text-red-700 text-sm font-medium transition disabled:opacity-50"
    >
      {loading ? "Canceling..." : "Cancel Booking"}
    </button>
  );
};
