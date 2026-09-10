"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const MarketingHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-4 bg-[#F8FAFC]/80 dark:bg-[#030712]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-[12px] bg-gradient-to-r from-[#38BDF8] to-[#2563EB] flex items-center justify-center text-white shadow-md shadow-[#38BDF8]/30 font-extrabold text-lg group-hover:scale-105 transition-transform">
            F
          </div>
          <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">FLOWDESK</span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-[12px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#38BDF8] to-[#2563EB] rounded-[12px] shadow-md shadow-[#38BDF8]/25 hover:shadow-lg hover:brightness-105 active:scale-95 transition-all inline-flex items-center gap-1.5"
          >
            <span>Start Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
