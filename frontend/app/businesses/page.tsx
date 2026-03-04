"use client";

import { useState } from "react";
import { useBusinesses } from "@/hooks/useBusinesses";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchInput } from "@/components/ui/SearchInput";
import { BusinessList } from "@/components/ui/BusinessList";
import { Pagination } from "@/components/ui/Pagination";
import { Loader2 } from "lucide-react";

const PAGE_SIZE = 9;

export default function BusinessesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useBusinesses({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Negocios</h1>
          <p className="text-gray-500 mt-1">
            Encuentra el servicio que necesitas
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar negocios..."
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <BusinessList businesses={data?.data ?? []} />
          {data?.meta && (
            <Pagination
              currentPage={data.meta.page}
              totalPages={data.meta.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
