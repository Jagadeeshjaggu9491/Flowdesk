"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Kanban,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#38BDF8]/20">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-8 overflow-hidden">
        {/* Glow backdrop blob with PeraCause Cyan Accent */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#38BDF8]/20 to-[#2563EB]/15 blur-[100px] rounded-full pointer-events-none" />

        <div ref={heroRef} className="max-w-5xl mx-auto text-center relative z-10">
          {/* Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8 text-xs font-bold text-slate-700">
            <span className="flex h-2 w-2 rounded-full bg-[#38BDF8]" />
            <span>Introducing FlowDesk with PeraCause Visual System</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Manage projects. <br />
            <span className="bg-gradient-to-r from-[#38BDF8] via-[#0284C7] to-[#2563EB] bg-clip-text text-transparent">
              Empower your team.
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Plan, collaborate and deliver better with one powerful workspace designed for modern companies.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#38BDF8] to-[#2563EB] rounded-[16px] shadow-lg shadow-[#38BDF8]/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Start Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-800 bg-white border border-slate-200 rounded-[16px] shadow-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center"
            >
              View Live Demo
            </Link>
          </div>

          {/* Product Showcase Window */}
          <div className="mt-16 p-3 sm:p-4 bg-white/70 backdrop-blur-2xl rounded-[28px] border border-slate-200 shadow-2xl">
            <div className="rounded-[20px] bg-white border border-slate-200 overflow-hidden shadow-inner">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-semibold text-slate-400">FlowDesk PeraCause Workspace</span>
              </div>
              <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-5 rounded-[18px] bg-slate-50/80 border border-slate-200">
                  <div className="w-10 h-10 rounded-[12px] bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold mb-4">
                    <Kanban className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Kanban & Sprint Boards</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Drag and drop tasks effortlessly across TODO, IN_PROGRESS, REVIEW, and DONE status columns.
                  </p>
                </div>

                <div className="p-5 rounded-[18px] bg-slate-50/80 border border-slate-200">
                  <div className="w-10 h-10 rounded-[12px] bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-4">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Real-Time Analytics</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Visualize team velocity, task completion timelines, and project milestone progress with Recharts.
                  </p>
                </div>

                <div className="p-5 rounded-[18px] bg-slate-50/80 border border-slate-200">
                  <div className="w-10 h-10 rounded-[12px] bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-4">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Multi-Tenant Isolation</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Strict role-based authorization (OWNER, ADMIN, MEMBER, VIEWER) and total workspace privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-600 mt-4 text-base">
            Choose the plan that fits your workspace size and team workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="p-8 rounded-[24px] bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Starter</h3>
              <p className="text-xs text-slate-500 mt-1">For individuals & small projects</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-xs text-slate-500 ml-1">/ forever free</span>
              </div>
              <ul className="mt-8 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Up to 1 Workspace</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Up to 5 Projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Kanban & Task Management</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full py-3 rounded-[12px] bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs text-center transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-[24px] bg-white border-2 border-[#38BDF8] shadow-xl relative flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 px-3 py-1 bg-gradient-to-r from-[#38BDF8] to-[#2563EB] text-white font-bold text-[10px] uppercase tracking-wider rounded-full shadow-sm">
              Most Popular
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Pro</h3>
              <p className="text-xs text-slate-500 mt-1">For growing teams & agencies</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900">$12</span>
                <span className="text-xs text-slate-500 ml-1">/ user / month</span>
              </div>
              <ul className="mt-8 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                  <span>Unlimited Workspaces & Projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                  <span>Advanced Kanban & Task Calendar</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                  <span>Recharts Velocity Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                  <span>Stripe Billing & Priority Support</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full py-3 rounded-[12px] bg-gradient-to-r from-[#38BDF8] to-[#2563EB] text-white font-bold text-xs text-center shadow-md transition-colors"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Business Tier */}
          <div className="p-8 rounded-[24px] bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Business</h3>
              <p className="text-xs text-slate-500 mt-1">For enterprise organizations</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900">$29</span>
                <span className="text-xs text-slate-500 ml-1">/ user / month</span>
              </div>
              <ul className="mt-8 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Full Platform Audit System Logs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Dedicated Admin Control Portal</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full py-3 rounded-[12px] bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs text-center transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© 2026 FlowDesk Inc. Work flows better together.</p>
        </div>
      </footer>
    </div>
  );
}
