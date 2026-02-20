interface BusinessCardProps {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
}
export const BusinessCard = ({
  name,
  description,
  address,
  phone,
}: BusinessCardProps) => {
  return (
    <div className="bg-gray-300 rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden hover:shadow-md transition-shadow duration-200">
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
    </div>
  );
};
