"use client";

import { useBusinesses } from "@/hooks/useBusinesses";
import { BusinessList } from "@/components/ui/BusinessList";
import { HeroSection } from "@/components/ui/HeroSection";
import { Navbar } from "@/components/ui/Navbar";
import { CTASection } from "@/components/ui/CtaSection";
import { Footer } from "@/components/ui/Footer";
import { Pagination } from "@/components/ui/Pagination";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Home() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 350);
  const { data, isLoading } = useBusinesses({
    page,
    limit: 6,
    search: debouncedSearch || undefined,
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-8 py-12">
        <HeroSection value={search} onChange={setSearch} />

        {isLoading ? (
          <div className="flex justify-center py-12">
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
      </main>
      <CTASection />
      <Footer />
    </div>
  );
}
