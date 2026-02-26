"use client";

import { useState } from "react";
import UpdateBookingModal from "./UpdateBookingModal";

interface Props {
  booking: any;
  onUpdateSuccess: (updatedBooking: any) => void;
}

export const UpdateBookingButton = ({ booking, onUpdateSuccess }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-blue-500 hover:text-blue-700 transition"
      >
        Editar reserva
      </button>

      {open && (
        <UpdateBookingModal
          booking={booking}
          onClose={() => setOpen(false)}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
    </>
  );
};
