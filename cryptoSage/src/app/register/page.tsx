"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/auth/register/", {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token); // Save token for authentication
        router.push("/dashboard"); // Redirect on success
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F17] px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#151B28] rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-500">Create an account</h2>
            <p className="mt-2 text-gray-400">Join CryptoSage AI today</p>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1E2736] border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 p-2 rounded-md"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1E2736] border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 p-2 rounded-md"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1E2736] border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 p-2 rounded-md"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#1E2736] border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 p-2 rounded-md"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-colors"
            >
              {loading ? "Registering..." : "Sign up"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-500 hover:text-purple-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
