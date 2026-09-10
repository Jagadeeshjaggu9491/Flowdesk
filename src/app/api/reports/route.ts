import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyWorkspaceMember } from "@/lib/permissions";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });

  await verifyWorkspaceMember(workspaceId, session.id);

  const totalTasks = await db.task.count({ where: { workspaceId } });
  const completedTasks = await db.task.count({ where: { workspaceId, status: "DONE" } });
  const inProgressTasks = await db.task.count({ where: { workspaceId, status: "IN_PROGRESS" } });
  const reviewTasks = await db.task.count({ where: { workspaceId, status: "REVIEW" } });
  const todoTasks = await db.task.count({ where: { workspaceId, status: "TODO" } });

  const urgentTasks = await db.task.count({ where: { workspaceId, priority: "URGENT" } });
  const highTasks = await db.task.count({ where: { workspaceId, priority: "HIGH" } });
  const mediumTasks = await db.task.count({ where: { workspaceId, priority: "MEDIUM" } });
  const lowTasks = await db.task.count({ where: { workspaceId, priority: "LOW" } });

  const projects = await db.project.findMany({
    where: { workspaceId },
    include: { tasks: true },
  });

  const projectProgress = projects.map((p) => {
    const doneCount = p.tasks.filter((t) => t.status === "DONE").length;
    const totalCount = p.tasks.length;
    const percentage = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
    return {
      id: p.id,
      name: p.name,
      color: p.color,
      totalTasks: totalCount,
      completedTasks: doneCount,
      progress: percentage,
    };
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return NextResponse.json({
    metrics: {
      totalTasks,
      completedTasks,
      inProgressTasks,
      reviewTasks,
      todoTasks,
      completionRate,
      urgentTasks,
    },
    statusDistribution: [
      { name: "Completed", value: completedTasks, color: "#10B981" },
      { name: "In Progress", value: inProgressTasks, color: "#635BFF" },
      { name: "In Review", value: reviewTasks, color: "#F59E0B" },
      { name: "To Do", value: todoTasks, color: "#9CA3AF" },
    ],
    priorityDistribution: [
      { name: "Urgent", value: urgentTasks, color: "#DC2626" },
      { name: "High", value: highTasks, color: "#F59E0B" },
      { name: "Medium", value: mediumTasks, color: "#635BFF" },
      { name: "Low", value: lowTasks, color: "#10B981" },
    ],
    projectProgress,
  });
}
