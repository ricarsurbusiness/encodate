/** eslint-disable @typescript-eslint/no-explicit-any */
import BookingCard from "./BookingCard";
import { Pagination } from "@/components/ui/Pagination";
import { Booking } from "@/types/booking";
import type { PaginationMeta } from "@/types/common";

interface Props {
  bookings: Booking[];
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function BookingList({
  bookings,
  meta,
  onPageChange,
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
          <BookingCard key={booking.id} booking={booking} />
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
