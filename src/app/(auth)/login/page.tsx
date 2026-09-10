"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-[#38BDF8]/20 to-[#2563EB]/15 blur-[90px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-[14px] bg-gradient-to-r from-[#38BDF8] to-[#2563EB] flex items-center justify-center text-white shadow-md shadow-[#38BDF8]/30 font-extrabold text-xl">
              F
            </div>
            <span className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">FLOWDESK</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in to your FlowDesk workspace</p>
        </div>

        {/* Floating Glass Login Card */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[24px] p-8 border border-slate-200 dark:border-slate-700 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-[12px] bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@company.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="pt-2">
              <Button type="submit" isLoading={isLoading} className="w-full py-3">
                <span>Sign In to FlowDesk</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-[#0284C7] dark:text-[#38BDF8] hover:underline">
              Create workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
