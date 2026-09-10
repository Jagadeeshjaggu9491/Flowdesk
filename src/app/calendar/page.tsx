"use client";

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";

export default function CalendarPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const wsRes = await fetch("/api/workspaces");
    if (wsRes.ok) {
      const wsData = await wsRes.json();
      const activeWs = wsData.workspaces?.[0];
      if (activeWs) {
        const tRes = await fetch(`/api/tasks?workspaceId=${activeWs.id}`);
        if (tRes.ok) {
          const tData = await tRes.json();
          setTasks(tData.tasks || []);
        }
      }
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-[#38BDF8]" />
              <span>Task Calendar</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Schedule &amp; due date timeline view</p>
          </div>
          {/* Month Nav */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-[12px] border border-slate-200 dark:border-slate-700 shadow-sm">
            <button className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-[8px] transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-900 dark:text-white px-2">September 2026</span>
            <button className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-[8px] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Month Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden p-6">
          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          {/* Day cells */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const dayTasks = tasks.slice((day % 3), (day % 3) + 1);
              return (
                <div
                  key={day}
                  className="min-h-[90px] p-2 rounded-[14px] bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between hover:border-[#38BDF8]/50 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{day}</span>
                  {dayTasks.length > 0 && (
                    <div className="p-1.5 rounded-[8px] bg-[#E0F2FE] dark:bg-[#0284C7]/20 text-[#0284C7] dark:text-[#38BDF8] text-[10px] font-bold truncate">
                      {dayTasks[0].title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
