"use client";

import { useState } from "react";
import { useMyBookings } from "@/hooks/useBookings";
import BookingList from "./components/BookingList";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { BookingStatus } from "@/types/booking";

const STATUS_OPTIONS: { label: string; value: BookingStatus | "" }[] = [
  { label: "Todas", value: "" },
  { label: "Pendientes", value: "PENDING" },
  { label: "Confirmadas", value: "CONFIRMED" },
  { label: "Canceladas", value: "CANCELLED" },
  { label: "Completadas", value: "COMPLETED" },
];

export default function MyBookingsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");

  const { data, isLoading } = useMyBookings({
    page,
    limit: 5,
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const bookings = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Volver al inicio
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">Mis reservas</h1>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setStatusFilter(option.value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              statusFilter === option.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Viendo {bookings.length} de {meta?.total ?? 0} reservas
      </p>

      {meta && (
        <BookingList
          bookings={bookings}
          meta={meta}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
