"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

interface Business {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = async () => {
    try {
      const { data } = await api.get("/businesses/my-businesses");
      setBusinesses(data);
    } catch (error) {
      toast.error("Error loading businesses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/businesses/${id}`);
      setBusinesses((prev) => prev.filter((b) => b.id !== id));
      toast.success("Business deleted");
    } catch {
      toast.error("Error deleting business");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Businesses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {businesses.map((business) => (
          <div key={business.id} className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold">{business.name}</h2>
            <p className="text-gray-500">{business.description}</p>
            <p className="text-sm text-gray-400">{business.address}</p>

            <button
              onClick={() => handleDelete(business.id)}
              className="mt-4 text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
