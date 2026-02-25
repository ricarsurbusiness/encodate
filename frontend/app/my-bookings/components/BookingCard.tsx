import BookingStatusBadge from "./BookingStatusBadge";
import { CancelBookingButton } from "./CancelBooking";
import { Booking } from "@/types/booking";

interface Props {
  booking: Booking;
  onCancelSuccess: (bookingId: string) => void;
}

export default function BookingCard({ booking, onCancelSuccess }: Props) {
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
        <div className="mt-4">
          <CancelBookingButton
            bookingId={booking.id}
            onCancelSuccess={onCancelSuccess}
          />
        </div>
      )}
    </div>
  );
}
