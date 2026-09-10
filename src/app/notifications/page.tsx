"use client";

import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      setNotifications(data.notifications || []);
    }
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Bell className="w-6 h-6 text-[#38BDF8]" />
              <span>Notifications</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Updates on tasks, comments, and project milestones</p>
          </div>
          <Button variant="secondary" onClick={markAllRead}>
            Mark All as Read
          </Button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-3">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 py-8 text-center">No notifications found.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-[16px] border flex items-center justify-between transition-colors ${
                  n.read
                    ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                    : "bg-[#E0F2FE]/40 dark:bg-[#0284C7]/10 border-[#38BDF8]/30 dark:border-[#38BDF8]/20"
                }`}
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{n.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{n.message}</p>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 ml-4">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
