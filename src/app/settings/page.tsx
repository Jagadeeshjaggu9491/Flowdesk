"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Settings as SettingsIcon, CreditCard } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "profile";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [workspace, setWorkspace] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const wsRes = await fetch("/api/workspaces");
    if (wsRes.ok) {
      const wsData = await wsRes.json();
      const activeWs = wsData.workspaces?.[0];
      setWorkspace(activeWs);

      if (activeWs) {
        const subRes = await fetch(`/api/billing?workspaceId=${activeWs.id}`);
        if (subRes.ok) {
          const subData = await subRes.json();
          setSubscription(subData.subscription);
        }
      }
    }
  };

  const handleUpgradePlan = async (plan: string) => {
    if (!workspace) return;
    setIsUpdating(true);
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId: workspace.id, plan }),
      });
      if (res.ok) loadSettings();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentPlan = subscription?.plan || "PRO";

  const planCardClass = (plan: string) =>
    `p-6 rounded-[24px] bg-white dark:bg-slate-900 border-2 ${
      currentPlan === plan
        ? "border-[#38BDF8] ring-2 ring-[#38BDF8]/20"
        : "border-slate-200 dark:border-slate-800"
    } shadow-sm flex flex-col justify-between transition-all`;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-[#38BDF8]" />
              <span>Workspace Settings</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage profile, preferences, and billing plans</p>
          </div>
        </div>

        <Tabs
          tabs={[
            { id: "profile", label: "Profile" },
            { id: "workspace", label: "Workspace" },
            { id: "billing", label: "Billing & Subscription" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* ── Billing Tab ── */}
        {activeTab === "billing" && (
          <div className="space-y-8">
            {/* Current Plan */}
            <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Active Subscription Tier
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{currentPlan} Plan</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Renews automatically on next billing cycle. Managed via Stripe.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" icon={<CreditCard className="w-4 h-4" />}>
                  Payment Method
                </Button>
              </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Starter */}
              <div className={planCardClass("FREE")}>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Starter</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$0</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/ forever free</span>
                  </div>
                </div>
                <Button
                  variant={currentPlan === "FREE" ? "secondary" : "ghost"}
                  disabled={currentPlan === "FREE"}
                  onClick={() => handleUpgradePlan("FREE")}
                  className="mt-6 w-full"
                >
                  {currentPlan === "FREE" ? "Current Plan" : "Downgrade"}
                </Button>
              </div>

              {/* Pro */}
              <div className={planCardClass("PRO")}>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Pro</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$12</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/ user / mo</span>
                  </div>
                </div>
                <Button
                  variant={currentPlan === "PRO" ? "secondary" : "primary"}
                  disabled={currentPlan === "PRO"}
                  isLoading={isUpdating}
                  onClick={() => handleUpgradePlan("PRO")}
                  className="mt-6 w-full"
                >
                  {currentPlan === "PRO" ? "Current Plan" : "Upgrade to Pro"}
                </Button>
              </div>

              {/* Business */}
              <div className={planCardClass("BUSINESS")}>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Business</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$29</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/ user / mo</span>
                  </div>
                </div>
                <Button
                  variant={currentPlan === "BUSINESS" ? "secondary" : "primary"}
                  disabled={currentPlan === "BUSINESS"}
                  isLoading={isUpdating}
                  onClick={() => handleUpgradePlan("BUSINESS")}
                  className="mt-6 w-full"
                >
                  {currentPlan === "BUSINESS" ? "Current Plan" : "Upgrade to Business"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Profile Tab ── */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-6 max-w-xl space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Profile Settings</h3>
            <Input label="Full Name" defaultValue="Alex Morgan" />
            <Input label="Email Address" defaultValue="owner@flowdesk.app" disabled />
            <Input label="Job Title" defaultValue="Founder & Product Lead" />
            <div className="pt-2">
              <Button>Save Profile Changes</Button>
            </div>
          </div>
        )}

        {/* ── Workspace Tab ── */}
        {activeTab === "workspace" && (
          <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-6 max-w-xl space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Workspace Settings</h3>
            <Input label="Workspace Name" defaultValue={workspace?.name || "Banda Technologies"} />
            <Input label="Industry" defaultValue="Software & SaaS" />
            <div className="pt-2">
              <Button>Save Workspace Details</Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
