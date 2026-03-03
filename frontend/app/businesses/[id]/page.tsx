"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";

interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export default function BusinessDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const serviceFromQuery = searchParams.get("service");

  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const { data } = await api.get(`/businesses/${id}`);

        console.log("Business:", data);

        setBusiness(data);
        setServices(data.services || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  useEffect(() => {
    if (serviceFromQuery && isAuthenticated && services.length > 0) {
      const service = services.find((s) => s.id === serviceFromQuery);

      if (service) {
        setSelectedService(service);

        // Limpiar el query param después de usarlo
        router.replace(`/businesses/${id}`);
      }
    }
  }, [serviceFromQuery, isAuthenticated, services, router, id]);
  const handleBook = (serviceId: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/businesses/${id}?service=${serviceId}`);
      return;
    }

    const service = services.find((s) => s.id === serviceId);
    if (service) {
      setSelectedService(service);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!business) return <p className="text-center mt-10">Business not found</p>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-3xl p-10 mb-12 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{business.name}</h1>
        <p className="text-lg text-slate-200 mb-2">{business.description}</p>
        <p className="text-sm text-slate-300">📍 {business.address}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Services</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-xl font-bold">{service.name}</h3>
            <p className="text-gray-600 mt-2 mb-4">{service.description}</p>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">${service.price}</p>
                <p className="text-sm text-gray-500">{service.duration} min</p>
              </div>

              <button
                onClick={() => handleBook(service.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedService && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">
              Booking: {selectedService.name}
            </h3>

            <div className="flex flex-col gap-4">
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
                className="border rounded-xl px-3 py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <input
                type="time"
                className="border rounded-xl px-3 py-2"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />

              <button
                disabled={bookingLoading}
                onClick={async () => {
                  if (!date || !time) {
                    alert("Please select date and time");
                    return;
                  }
                  const selectedDateTime = new Date(`${date}T${time}`);
                  const now = new Date();

                  if (selectedDateTime <= now) {
                    alert("Please select a future time");
                    return;
                  }

                  try {
                    setBookingLoading(true);

                    const startDateTime = new Date(
                      `${date}T${time}`,
                    ).toISOString();

                    await api.post("/bookings", {
                      serviceId: selectedService.id,
                      startTime: startDateTime,
                    });

                    router.replace("/my-bookings");
                  } catch (error) {
                    console.error(error);
                    setBookingLoading(false);
                    alert("Error creating booking");
                  }
                }}
                className="bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </button>
              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
