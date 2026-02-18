"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone }),
      });
      if (response.ok) {
        router.push("/login");
      } else {
        setError("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        className="border rounded px-3 py-2 w-full"
        type="text"
        value={name}
        required={true}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        className="border rounded px-3 py-2 w-full"
        type="email"
        value={email}
        required={true}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="border rounded px-3 py-2 w-full"
        type="password"
        value={password}
        required={true}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <input
        className="border rounded px-3 py-2 w-full"
        type="password"
        value={confirmPassword}
        required={true}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
      />
      <input
        className="border rounded px-3 py-2 w-full"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
      />
      <button
        className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
        type="submit"
      >
        Register
      </button>
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <p className="text-gray-500">Already have an account?</p>
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </div>
    </form>
  );
}
