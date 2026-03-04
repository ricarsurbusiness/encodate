"use client";
import { useCancelBooking } from "@/hooks/useBookings";
import { toast } from "sonner";

interface CancelBookingButtonProps {
  bookingId: string;
}

export const CancelBookingButton = ({
  bookingId,
}: CancelBookingButtonProps) => {
  const { mutate, isPending } = useCancelBooking();

  const handleCancel = () => {
    const confirmCancel = confirm("¿Estás seguro de cancelar esta reserva?");
    if (!confirmCancel) return;

    mutate(bookingId, {
      onSuccess: () => {
        toast.success("Reserva cancelada exitosamente");
      },
      onError: () => {
        toast.error("Error al cancelar la reserva");
      },
    });
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="text-red-500 hover:text-red-700 transition"
    >
      {isPending ? "Cancelando..." : "Cancelar reserva"}
    </button>
  );
};
