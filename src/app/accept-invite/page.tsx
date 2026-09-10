"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      verifyInviteToken();
    } else {
      setError("No invitation token provided");
      setLoading(false);
    }
  }, [token]);

  const verifyInviteToken = async () => {
    try {
      const res = await fetch(`/api/invitations/verify?token=${token}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid or expired invitation token");
      } else {
        setInvitation(data.invitation);
      }
    } catch (e: any) {
      setError(e.message || "Failed to verify invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to accept invitation");
        setIsSubmitting(false);
        return;
      }

      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] flex items-center justify-center transition-colors">
        <Loader2 className="w-8 h-8 animate-spin text-[#38BDF8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] flex flex-col justify-center items-center p-4 font-sans transition-colors duration-300 relative">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-[#38BDF8]/20 to-[#2563EB]/15 blur-[90px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-[14px] bg-gradient-to-r from-[#38BDF8] to-[#2563EB] flex items-center justify-center text-white shadow-md shadow-[#38BDF8]/30 font-extrabold text-xl">
              F
            </div>
            <span className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">FLOWDESK</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Workspace Invitation</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Join your team on FlowDesk</p>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[24px] p-8 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-6">
          {error ? (
            <div className="p-4 rounded-[14px] bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-semibold">
              {error}
            </div>
          ) : (
            <div>
              {/* Workspace info banner */}
              <div className="p-4 rounded-[16px] bg-[#E0F2FE] dark:bg-[#0284C7]/10 border border-[#38BDF8]/30 dark:border-[#38BDF8]/20 text-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#38BDF8] mx-auto mb-2" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{invitation?.workspace?.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Invited by {invitation?.invitedBy?.name} ({invitation?.email})
                </p>
              </div>

              <form onSubmit={handleAccept} className="space-y-4">
                <Input
                  label="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Vance"
                  required
                />

                <Input
                  label="Create Account Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                <Button type="submit" isLoading={isSubmitting} className="w-full py-3">
                  <span>Accept &amp; Join Workspace</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#38BDF8] border-t-transparent animate-spin" />
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  );
}
