"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Skeleton, CardSkeleton } from "@/components/ui/Skeleton";

const chartData = [
  { day: "Mon", completed: 12, created: 18 },
  { day: "Tue", completed: 19, created: 22 },
  { day: "Wed", completed: 24, created: 15 },
  { day: "Thu", completed: 31, created: 28 },
  { day: "Fri", completed: 42, created: 35 },
  { day: "Sat", completed: 28, created: 14 },
  { day: "Sun", completed: 35, created: 20 },
];

export default function DashboardPage() {
  const [reports, setReports] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [workspace, setWorkspace] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const wsRes = await fetch("/api/workspaces");
      if (wsRes.ok) {
        const wsData = await wsRes.json();
        const activeWs = wsData.workspaces?.[0];
        setWorkspace(activeWs);

        if (activeWs) {
          const [repRes, projRes, taskRes] = await Promise.all([
            fetch(`/api/reports?workspaceId=${activeWs.id}`),
            fetch(`/api/projects?workspaceId=${activeWs.id}`),
            fetch(`/api/tasks?workspaceId=${activeWs.id}`),
          ]);

          if (repRes.ok) setReports(await repRes.json());
          if (projRes.ok) {
            const pData = await projRes.json();
            setProjects(pData.projects || []);
          }
          if (taskRes.ok) {
            const tData = await taskRes.json();
            setTasks(tData.tasks || []);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = reports?.metrics || {
    totalTasks: 184,
    completedTasks: 132,
    inProgressTasks: 38,
    completionRate: 72,
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Workspace Overview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {workspace?.name || "Acme Corp"} • Real-time project activity & sprint velocity
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/projects">
              <Button icon={<Plus className="w-4 h-4" />}>New Project</Button>
            </Link>
          </div>
        </div>

        {/* Top iOS Metric KPI Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Card 1: Active Projects */}
            <div className="p-6 rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Active Projects
                </span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 block">
                  {projects.length || 24}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+12% this month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-[16px] bg-[#E0F2FE] dark:bg-slate-800 text-[#0284C7] dark:text-[#38BDF8] flex items-center justify-center font-bold">
                <FolderKanban className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Total Tasks */}
            <div className="p-6 rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Total Tasks
                </span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 block">
                  {metrics.totalTasks}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{metrics.inProgressTasks} in progress</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-[16px] bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Completed Tasks */}
            <div className="p-6 rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Completed Tasks
                </span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 block">
                  {metrics.completedTasks}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{metrics.completionRate}% completion rate</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-[16px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            {/* Card 4: Team Members */}
            <div className="p-6 rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Team Members
                </span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 block">
                  {workspace?.members?.length || 1}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Active workspace</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-[16px] bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-[#38BDF8] flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}

        {/* Charts & Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Completion Chart */}
          <div className="lg:col-span-2 p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Task Velocity & Throughput</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Weekly completed vs created task trends</p>
              </div>
              <Badge variant="purple">LIVE RECHARTS</Badge>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderRadius: "12px",
                      border: "1px solid #1E293B",
                      color: "#F8FAFC",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#38BDF8"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Breakdown Pie Chart */}
          <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Status Breakdown</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Task distribution across columns</p>
              <div className="h-44 w-full mt-4 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reports?.statusDistribution || [
                        { name: "Completed", value: 132, color: "#10B981" },
                        { name: "In Progress", value: 38, color: "#38BDF8" },
                        { name: "Review", value: 10, color: "#F59E0B" },
                        { name: "To Do", value: 4, color: "#64748B" },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {(reports?.statusDistribution || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="text-slate-600 dark:text-slate-400">Done</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                <span className="text-slate-600 dark:text-slate-400">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="text-slate-600 dark:text-slate-400">Review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#64748B]" />
                <span className="text-slate-600 dark:text-slate-400">To Do</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Preview & Recent Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Projects List */}
          <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Projects</h3>
              <Link href="/projects" className="text-xs font-bold text-[#38BDF8] hover:underline flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {projects.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center justify-between p-3.5 rounded-[16px] bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-[12px] flex items-center justify-center font-extrabold text-white text-xs shadow-sm"
                      style={{ backgroundColor: p.color || "#38BDF8" }}
                    >
                      {p.key || p.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-[#38BDF8] transition-colors">
                        {p.name}
                      </h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {p.tasks?.length || 0} tasks assigned
                      </span>
                    </div>
                  </div>
                  <Badge variant="purple">Active</Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks List */}
          <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Tasks</h3>
              <Link href="/tasks" className="text-xs font-bold text-[#38BDF8] hover:underline flex items-center gap-1">
                <span>Task List</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {tasks.slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3.5 rounded-[16px] bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        t.status === "DONE"
                          ? "bg-emerald-500"
                          : t.status === "IN_PROGRESS"
                          ? "bg-[#38BDF8]"
                          : "bg-amber-500"
                      }`}
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.title}</h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Priority: {t.priority} • {t.project?.name || "Project"}
                      </span>
                    </div>
                  </div>
                  {t.assignee && <Avatar name={t.assignee.name} src={t.assignee.avatarUrl} size="sm" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
