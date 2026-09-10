"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar as CalendarIcon,
  Users,
  Bell,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Search,
  Plus,
  Zap,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        router.push("/login");
        return;
      }
      const meData = await meRes.json();
      setUser(meData.user);

      const wsRes = await fetch("/api/workspaces");
      if (wsRes.ok) {
        const wsData = await wsRes.json();
        setWorkspaces(wsData.workspaces || []);
        if (wsData.workspaces?.length > 0) {
          setCurrentWorkspace(wsData.workspaces[0]);
        }
      }

      const notifRes = await fetch("/api/notifications");
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData.notifications || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Projects", href: "/projects", icon: FolderKanban },
    { label: "Kanban Board", href: "/kanban", icon: FolderKanban },
    { label: "Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Calendar", href: "/calendar", icon: CalendarIcon },
    { label: "Team", href: "/team", icon: Users },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  if (user?.isSuperAdmin) {
    navItems.push({ label: "Admin Portal", href: "/admin", icon: Shield });
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans antialiased transition-colors duration-300">
      {/* Desktop Floating Sidebar */}
      <aside className="hidden md:flex flex-col w-64 p-4 sticky top-0 h-screen z-30">
        <div className="ios-glass rounded-[24px] p-4 h-full flex flex-col justify-between shadow-lg border border-slate-200 dark:border-slate-800">
          <div>
            {/* FlowDesk Brand Logo with PeraCause Cyan-Blue Gradient */}
            <div className="flex items-center gap-3 px-2 py-1 mb-6">
              <div className="w-9 h-9 rounded-[12px] bg-gradient-to-r from-[#38BDF8] to-[#2563EB] flex items-center justify-center text-white shadow-md shadow-[#38BDF8]/30 font-extrabold text-lg tracking-wider">
                F
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">FLOWDESK</span>
                <span className="block text-[10px] font-bold text-[#0284C7] dark:text-[#38BDF8] uppercase tracking-wider">PeraCause System</span>
              </div>
            </div>

            {/* Workspace Selector Widget */}
            <div className="relative mb-6">
              <button
                onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
                className="w-full flex items-center justify-between p-2.5 rounded-[14px] bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-150 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-[8px] bg-[#E0F2FE] dark:bg-slate-700 text-[#0284C7] dark:text-[#38BDF8] flex items-center justify-center font-bold text-xs">
                    {currentWorkspace?.name?.[0] || "W"}
                  </div>
                  <div className="text-left truncate">
                    <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentWorkspace?.name || "Banda Technologies"}
                    </span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {currentWorkspace?.userRole || "OWNER"}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* Workspace Dropdown */}
              {showWorkspaceMenu && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 rounded-[16px] shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in duration-150">
                  <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase">Switch Workspace</div>
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        setCurrentWorkspace(ws);
                        setShowWorkspaceMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-semibold transition-colors cursor-pointer ${
                        currentWorkspace?.id === ws.id ? "bg-[#E0F2FE] dark:bg-slate-800 text-[#0284C7] dark:text-[#38BDF8]" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span>{ws.name}</span>
                      {currentWorkspace?.id === ws.id && <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />}
                    </button>
                  ))}
                  <Link
                    href="/onboarding"
                    className="flex items-center gap-2 px-3 py-2 mt-1 rounded-[10px] text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8] hover:bg-[#E0F2FE] dark:hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Workspace</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-gradient-to-r from-[#38BDF8] to-[#2563EB] text-white shadow-md shadow-[#38BDF8]/25 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-white/70 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile Card */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-2 rounded-[14px] bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Avatar name={user?.name || "User"} src={user?.avatarUrl} size="sm" />
                <div className="truncate">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || "User"}</span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-[8px] transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header with Theme Toggle Switch */}
        <header className="sticky top-0 z-20 px-4 py-3 bg-[#F8FAFC]/80 dark:bg-[#030712]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight capitalize">
                {pathname.split("/")[1] || "Dashboard"}
              </h1>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Global Search Bar */}
            <div className="hidden sm:flex items-center relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search projects, tasks..."
                className="w-full bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[12px] pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/30"
              />
            </div>

            {/* Dark Mode Theme Toggle Switch */}
            <ThemeToggle />

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-[12px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#38BDF8] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-[20px] shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Notifications</h4>
                    <button
                      onClick={async () => {
                        await fetch("/api/notifications", {
                          method: "PUT",
                          body: JSON.stringify({ markAllRead: true }),
                        });
                        setNotifications(notifications.map((n) => ({ ...n, read: true })));
                      }}
                      className="text-[10px] font-semibold text-[#0284C7] dark:text-[#38BDF8] hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="mt-2 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="py-2.5 text-xs">
                          <span className="font-semibold text-slate-900 dark:text-white block">{n.title}</span>
                          <span className="text-slate-600 dark:text-slate-400 text-[11px] block mt-0.5">{n.message}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Upgrade CTA */}
            <Link
              href="/settings?tab=billing"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-gradient-to-r from-[#38BDF8] to-[#2563EB] text-white font-bold text-xs shadow-sm hover:brightness-105 transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Pro Plan</span>
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
            <div className="relative w-72 bg-white dark:bg-slate-900 h-full p-5 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-lg text-slate-900 dark:text-white">FLOWDESK</span>
                  <button onClick={() => setIsMobileOpen(false)}>
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-sm font-medium ${
                          pathname === item.href ? "bg-gradient-to-r from-[#38BDF8] to-[#2563EB] text-white" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
