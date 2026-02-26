import BookingStatusBadge from "./BookingStatusBadge";
import { CancelBookingButton } from "./CancelBooking";
import { UpdateBookingButton } from "./UpdateBooking";
import { Booking } from "@/types/booking";

interface Props {
  booking: Booking;
  onCancelSuccess: (bookingId: string) => void;
  onUpdateSuccess: (updatedBooking: Booking) => void;
}

export default function BookingCard({
  booking,
  onCancelSuccess,
  onUpdateSuccess,
}: Props) {
  const date = new Date(booking.startTime);

  return (
    <div className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{booking.service.name}</h3>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="text-gray-600 space-y-1">
        <p>📅 {date.toLocaleDateString()}</p>
        <p>
          ⏰{" "}
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
        <p>💵 ${booking.service.price}</p>
      </div>

      {booking.status === "PENDING" && (
        <div className="mt-6 flex gap-6 text-sm font-medium">
          <CancelBookingButton
            bookingId={booking.id}
            onCancelSuccess={onCancelSuccess}
          />

          <UpdateBookingButton
            booking={booking}
            onUpdateSuccess={onUpdateSuccess}
          />
        </div>
      )}
    </div>
  );
}
