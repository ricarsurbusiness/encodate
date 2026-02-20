import { BusinessCard } from "@/components/ui/BusinessCard";
import { HeroSection } from "@/components/ui/HeroSection";
import { Navbar } from "@/components/ui/Navbar";

interface Business {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
}
export default async function Home() {
  const businesses = await (async () => {
    const response = await fetch("http://localhost:3000/businesses");
    const json = await response.json();
    return json.data;
  })();
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-8 py-12">
        <HeroSection />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {businesses.map((business: Business) => (
            <BusinessCard
              key={business.id}
              name={business.name}
              description={business.description}
              address={business.address}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
