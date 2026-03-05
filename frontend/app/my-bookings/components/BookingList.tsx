/** eslint-disable @typescript-eslint/no-explicit-any */
import BookingCard from "./BookingCard";
import { Pagination } from "@/components/ui/Pagination";
import { Booking } from "@/types/booking";
import { Calendar } from "lucide-react";
import Link from "next/link";
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
      <div className="text-center py-12">
        <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500 font-medium">No tienes reservas aún</p>
        <p className="text-sm text-gray-400 mt-1">
          Explora negocios y crea tu primera reserva
        </p>
        <Link
          href="/businesses"
          className="text-sm text-blue-600 hover:underline mt-4 inline-block"
        >
          Buscar negocios →
        </Link>
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
