"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, CheckCircle2, ShieldAlert } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { Tabs } from "@/components/ui/Tabs";

export default function ReportsPage() {
  const [reports, setReports] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadReports();
    // Detect dark mode
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const loadReports = async () => {
    const wsRes = await fetch("/api/workspaces");
    if (wsRes.ok) {
      const wsData = await wsRes.json();
      const activeWs = wsData.workspaces?.[0];
      if (activeWs) {
        const repRes = await fetch(`/api/reports?workspaceId=${activeWs.id}`);
        if (repRes.ok) {
          const rData = await repRes.json();
          setReports(rData);
        }
      }
    }
  };

  const metrics = reports?.metrics || {
    totalTasks: 184,
    completedTasks: 132,
    completionRate: 72,
    urgentTasks: 8,
  };

  const tooltipStyle = {
    backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
    borderRadius: "12px",
    border: `1px solid ${isDark ? "#1E293B" : "#E5E7EB"}`,
    boxShadow: isDark
      ? "0 10px 25px -5px rgba(0,0,0,0.5)"
      : "0 10px 25px -5px rgba(0,0,0,0.1)",
    color: isDark ? "#F8FAFC" : "#0F172A",
  };

  const axisColor = isDark ? "#475569" : "#9CA3AF";

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#38BDF8]" />
              <span>Analytics &amp; Reports</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sprint performance, velocity metrics, and completion analytics
            </p>
          </div>
          <Tabs
            tabs={[
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "90d", label: "90 Days" },
            ]}
            activeTab={timeRange}
            onChange={setTimeRange}
          />
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Completion Rate */}
          <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Overall Completion Rate
            </span>
            <span className="text-4xl font-black text-slate-900 dark:text-white mt-2 block">
              {metrics.completionRate}%
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>Target: 70%+</span>
            </div>
          </div>

          {/* Tasks Completed */}
          <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Tasks Completed
            </span>
            <span className="text-4xl font-black text-slate-900 dark:text-white mt-2 block">
              {metrics.completedTasks}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>out of {metrics.totalTasks} total</span>
            </div>
          </div>

          {/* Urgent Items */}
          <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Urgent Items
            </span>
            <span className="text-4xl font-black text-red-600 dark:text-red-400 mt-2 block">
              {metrics.urgentTasks}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 mt-2">
              <ShieldAlert className="w-4 h-4" />
              <span>High Priority Attention</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-6">Project Progress Breakdown</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reports?.projectProgress || []}>
                <XAxis dataKey="name" stroke={axisColor} fontSize={11} tickLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }} />
                <Bar dataKey="progress" fill="#38BDF8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
