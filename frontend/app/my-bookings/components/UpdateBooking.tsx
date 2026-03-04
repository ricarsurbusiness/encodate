"use client";

import { useState } from "react";
import UpdateBookingModal from "./UpdateBookingModal";
import { Booking } from "@/types/booking";

interface Props {
  booking: Booking;
}

export const UpdateBookingButton = ({ booking }: Props) => {
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
        />
      )}
    </>
  );
};
