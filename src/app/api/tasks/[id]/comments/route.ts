import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyWorkspaceMember } from "@/lib/permissions";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: taskId } = await params;

  const comments = await db.taskComment.findMany({
    where: { taskId },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true, jobTitle: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ comments });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: taskId } = await params;
  const { content, workspaceId } = await req.json();

  if (!content || !workspaceId) {
    return NextResponse.json({ error: "Content and workspaceId required" }, { status: 400 });
  }

  await verifyWorkspaceMember(workspaceId, session.id);

  const comment = await db.taskComment.create({
    data: {
      taskId,
      userId: session.id,
      content,
    },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true, jobTitle: true } },
    },
  });

  // Record activity
  const task = await db.task.findUnique({ where: { id: taskId } });
  if (task) {
    await db.activity.create({
      data: {
        workspaceId,
        userId: session.id,
        projectId: task.projectId,
        action: "added comment",
        target: task.title,
      },
    });
  }

  return NextResponse.json({ success: true, comment });
}
