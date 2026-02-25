import Link from "next/link";
interface BusinessCardProps {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
}
export const BusinessCard = ({
  id,
  name,
  description,
  address,
  phone,
}: BusinessCardProps) => {
  return (
    <Link href={`/businesses/${id}`}>
      <div className="bg-gray-300 rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer">
        <div className="flex items-center">
          <div>
            <h2 className="text-xl font-bold">{name}</h2>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-700">{description}</p>
        </div>

        <div className="mt-4">
          <p className="text-gray-700">{address}</p>
          <p className="text-gray-700">{phone}</p>
        </div>

        <div className="mt-4 text-blue-600 font-semibold">View Details →</div>
      </div>
    </Link>
  );
};
