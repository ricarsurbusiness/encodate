/** eslint-disable @typescript-eslint/no-explicit-any */
import BookingCard from "./BookingCard";
import { Pagination } from "@/components/ui/Pagination";
import { Booking, BookingMeta } from "@/types/booking";

interface Props {
  bookings: Booking[];
  meta: BookingMeta;
  onPageChange: (page: number) => void;
  onCancelSuccess: (bookingId: string) => void;
  onUpdateSuccess: (updatedBooking: Booking) => void;
}

export default function BookingList({
  bookings,
  meta,
  onPageChange,
  onCancelSuccess,
  onUpdateSuccess,
}: Props) {
  if (!bookings.length) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No tienes reservas aún.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onCancelSuccess={onCancelSuccess}
            onUpdateSuccess={onUpdateSuccess}
          />
        ))}
      </div>

      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
