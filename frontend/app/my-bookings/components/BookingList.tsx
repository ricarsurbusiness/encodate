/** eslint-disable @typescript-eslint/no-explicit-any */
import BookingCard from "./BookingCard";
import { Pagination } from "@/components/ui/Pagination";
import { Booking, BookingMeta } from "@/types/booking";

interface Props {
  bookings: Booking[];
  meta: BookingMeta;
  onPageChange: (page: number) => void;
  onCancelSuccess: (bookingId: string) => void;
}

export default function BookingList({
  bookings,
  meta,
  onPageChange,
  onCancelSuccess,
}: Props) {
  if (!bookings.length) {
    return (
      <div className="text-center text-gray-500 mt-10">
        You don’t have any bookings yet.
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
