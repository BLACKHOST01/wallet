"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">
        Welcome, {user.firstName} {user.lastName} 👋
      </h1>

      <p>Email: {user.email}</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
