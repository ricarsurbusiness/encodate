import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-12 justify-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold">Encodate</h1>
        <div className="flex flex-col items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}
