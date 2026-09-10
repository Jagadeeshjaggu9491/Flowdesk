"use client";

import React, { useState, useEffect } from "react";
import { Users, UserPlus, Mail, Trash2, Copy, Check, Sparkles, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { TableSkeleton } from "@/components/ui/Skeleton";

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [workspace, setWorkspace] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ email: string; inviteUrl: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    setIsLoading(true);
    try {
      const wsRes = await fetch("/api/workspaces");
      if (wsRes.ok) {
        const wsData = await wsRes.json();
        const activeWs = wsData.workspaces?.[0];
        setWorkspace(activeWs);

        if (activeWs) {
          const mRes = await fetch(`/api/workspaces/${activeWs.id}/members`);
          if (mRes.ok) {
            const mData = await mRes.json();
            setMembers(mData.members || []);
            setInvitations(mData.invitations || []);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !email) return;
    setIsSubmitting(true);
    setInviteResult(null);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/workspaces/${workspace.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { error: "Failed to parse server response" };
      }

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to process invitation");
        return;
      }

      setInviteResult({ email, inviteUrl: data.inviteUrl || `${window.location.origin}/dashboard` });
      setEmail("");
      setIsModalOpen(false);
      loadTeam();
    } catch (e: any) {
      setErrorMessage(e.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    await fetch(`/api/workspaces/${workspace.id}/members`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId, role: newRole }),
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    await fetch(`/api/workspaces/${workspace.id}/members?memberId=${memberId}`, {
      method: "DELETE",
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-[#38BDF8]" />
              <span>Team &amp; Members</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage workspace access and role permissions</p>
          </div>
          <Button
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => { setInviteResult(null); setErrorMessage(""); setIsModalOpen(true); }}
          >
            Invite Member
          </Button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-[18px] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Banner */}
        {inviteResult && (
          <div className="p-4 rounded-[18px] bg-[#E0F2FE] dark:bg-slate-800 border border-[#38BDF8]/30 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#38BDF8] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Invitation Dispatched to {inviteResult.email}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  An email invitation has been sent. You can also copy the direct join link below:
                </p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(inviteResult.inviteUrl)}
              className="px-3 py-1.5 rounded-[10px] bg-white dark:bg-slate-700 border border-[#38BDF8]/30 dark:border-slate-600 text-xs font-bold text-[#38BDF8] hover:bg-[#38BDF8] hover:text-white transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Link!" : "Copy Invite Link"}</span>
            </button>
          </div>
        )}

        {/* Members Table */}
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar name={m.user.name} src={m.user.avatarUrl} size="md" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-sm block">{m.user.name}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{m.user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.id, e.target.value)}
                        className="bg-slate-100 dark:bg-slate-800 dark:text-slate-200 border border-transparent dark:border-slate-700 rounded-[10px] px-2.5 py-1 text-xs font-bold text-slate-800 outline-none"
                      >
                        <option value="OWNER">Owner</option>
                        <option value="ADMIN">Admin</option>
                        <option value="MEMBER">Member</option>
                        <option value="VIEWER">Viewer</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="success">Active</Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-[8px] transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Invite Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Invite Team Member"
          subtitle="Send an invitation email & generate a join link"
        >
          <form onSubmit={handleInvite} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-[12px] bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-600 dark:text-red-400">
                {errorMessage}
              </div>
            )}

            <Input
              label="Work Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Role Permission</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-100/80 dark:bg-slate-800 dark:text-slate-100 border border-transparent dark:border-slate-700 rounded-[12px] p-3 text-sm focus:bg-white dark:focus:bg-slate-900 focus:border-[#38BDF8] outline-none"
              >
                <option value="ADMIN">Admin (Full workspace management)</option>
                <option value="MEMBER">Member (Create and edit assigned tasks)</option>
                <option value="VIEWER">Viewer (Read-only project access)</option>
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" isLoading={isSubmitting}>Send Email &amp; Link</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
