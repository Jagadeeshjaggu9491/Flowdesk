"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Users,
  Building,
  CreditCard,
  FileText,
  TrendingUp,
  DollarSign,
  Search,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/Input";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const data = await res.json();
        setAdminData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const metrics = adminData?.metrics || {
    totalUsers: 48,
    totalWorkspaces: 14,
    totalProjects: 62,
    mrr: 1840,
    arr: 22080,
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#635BFF]" />
              <span>Platform Admin Control Center</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">Super-admin platform management & audit system</p>
          </div>
          <Badge variant="purple">Super Admin</Badge>
        </div>

        <Tabs
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "users", label: "Users", count: adminData?.users?.length || 0 },
            { id: "workspaces", label: "Workspaces", count: adminData?.workspaces?.length || 0 },
            { id: "logs", label: "System Audit Logs" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-[24px] bg-white border border-gray-200/80 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Total Platform Users
                </span>
                <span className="text-3xl font-extrabold text-gray-900 mt-2 block">
                  {metrics.totalUsers}
                </span>
              </div>

              <div className="p-6 rounded-[24px] bg-white border border-gray-200/80 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Active Workspaces
                </span>
                <span className="text-3xl font-extrabold text-gray-900 mt-2 block">
                  {metrics.totalWorkspaces}
                </span>
              </div>

              <div className="p-6 rounded-[24px] bg-white border border-gray-200/80 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Monthly Recurring Revenue (MRR)
                </span>
                <span className="text-3xl font-extrabold text-emerald-600 mt-2 block">
                  ${metrics.mrr}
                </span>
              </div>

              <div className="p-6 rounded-[24px] bg-white border border-gray-200/80 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Annual Recurring Revenue (ARR)
                </span>
                <span className="text-3xl font-extrabold text-gray-900 mt-2 block">
                  ${metrics.arr}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-[24px] border border-gray-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Joined Date</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {adminData?.users?.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">{u.name}</td>
                    <td className="py-4 px-6 text-gray-600">{u.email}</td>
                    <td className="py-4 px-6 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="success">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "workspaces" && (
          <div className="bg-white rounded-[24px] border border-gray-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Workspace Name</th>
                  <th className="py-3.5 px-6">Members</th>
                  <th className="py-3.5 px-6">Projects</th>
                  <th className="py-3.5 px-6">Subscription Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {adminData?.workspaces?.map((ws: any) => (
                  <tr key={ws.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">{ws.name}</td>
                    <td className="py-4 px-6 text-gray-600">{ws.members?.length || 1}</td>
                    <td className="py-4 px-6 text-gray-600">{ws.projects?.length || 0}</td>
                    <td className="py-4 px-6">
                      <Badge variant="purple">
                        {ws.subscriptions?.[0]?.plan || "PRO"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="bg-white rounded-[24px] border border-gray-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Action</th>
                  <th className="py-3.5 px-6">Resource</th>
                  <th className="py-3.5 px-6">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-mono">
                {adminData?.auditLogs?.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">{log.user?.name || "System"}</td>
                    <td className="py-4 px-6 text-[#635BFF] font-semibold">{log.action}</td>
                    <td className="py-4 px-6 text-gray-600">{log.resource}</td>
                    <td className="py-4 px-6 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
