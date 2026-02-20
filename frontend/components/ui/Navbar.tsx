import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {}
          <h1>ENCODATE</h1>
          <div className="flex gap-10">
            <Link href="/explore" className="text-gray-600 hover:text-blue-600">
              Explore
            </Link>
            <Link
              href="/for-business"
              className="text-gray-600 hover:text-blue-600"
            >
              For Business
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-blue-600">
              Blog
            </Link>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="rounded bg-white px-4 py-2 text-black hover:text-blue-400"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded bg-blue-700 px-4 py-2 text-gray-200 hover:text-blue-400"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
