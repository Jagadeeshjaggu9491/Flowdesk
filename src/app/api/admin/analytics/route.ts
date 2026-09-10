import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const totalUsers = await db.user.count();
  const totalWorkspaces = await db.workspace.count();
  const totalProjects = await db.project.count();
  const totalTasks = await db.task.count();

  const activeSubscriptions = await db.subscription.findMany({
    where: { status: "ACTIVE" },
  });

  const proCount = activeSubscriptions.filter((s) => s.plan === "PRO").length;
  const bizCount = activeSubscriptions.filter((s) => s.plan === "BUSINESS").length;

  const mrr = proCount * 12 + bizCount * 29;
  const arr = mrr * 12;

  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      jobTitle: true,
      avatarUrl: true,
      createdAt: true,
      memberships: {
        include: { workspace: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const workspaces = await db.workspace.findMany({
    include: {
      members: { include: { user: { select: { name: true, email: true } } } },
      projects: { select: { id: true, name: true } },
      subscriptions: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const auditLogs = await db.auditLog.findMany({
    include: {
      user: { select: { name: true, email: true } },
      workspace: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json({
    metrics: {
      totalUsers,
      totalWorkspaces,
      totalProjects,
      totalTasks,
      mrr,
      arr,
      proSubscriptions: proCount,
      businessSubscriptions: bizCount,
    },
    users,
    workspaces,
    auditLogs,
  });
}
