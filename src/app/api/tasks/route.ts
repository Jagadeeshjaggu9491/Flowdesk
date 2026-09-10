import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyWorkspaceMember } from "@/lib/permissions";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  const projectId = searchParams.get("projectId");
  const assigneeId = searchParams.get("assigneeId");

  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
  }

  await verifyWorkspaceMember(workspaceId, session.id);

  const whereClause: any = { workspaceId };
  if (projectId) whereClause.projectId = projectId;
  if (assigneeId) whereClause.assigneeId = assigneeId;

  const tasks = await db.task.findMany({
    where: whereClause,
    include: {
      project: { select: { id: true, name: true, key: true, color: true } },
      assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
      creator: { select: { id: true, name: true, avatarUrl: true } },
      labels: true,
      comments: {
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { createdAt: "asc" },
      },
      attachments: true,
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workspaceId, projectId, title, description, priority, status, assigneeId, dueDate } = await req.json();

  if (!workspaceId || !projectId || !title) {
    return NextResponse.json({ error: "Workspace, project, and title are required" }, { status: 400 });
  }

  await verifyWorkspaceMember(workspaceId, session.id);

  const taskCount = await db.task.count({ where: { projectId, status: status || "TODO" } });

  const task = await db.task.create({
    data: {
      workspaceId,
      projectId,
      title,
      description,
      priority: priority || "MEDIUM",
      status: status || "TODO",
      assigneeId: assigneeId || null,
      creatorId: session.id,
      order: taskCount + 1,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
    include: {
      project: { select: { id: true, name: true, key: true, color: true } },
      assignee: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  // Record activity
  await db.activity.create({
    data: {
      workspaceId,
      userId: session.id,
      projectId,
      action: "created task",
      target: title,
    },
  });

  // Notify assignee if specified
  if (assigneeId && assigneeId !== session.id) {
    await db.notification.create({
      data: {
        workspaceId,
        userId: assigneeId,
        title: "Task Assigned",
        message: `${session.name} assigned you to "${title}"`,
        type: "TASK_ASSIGNED",
        link: `/projects/${projectId}`,
      },
    });
  }

  return NextResponse.json({ success: true, task });
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { taskId, status, order, title, description, priority, assigneeId, dueDate, workspaceId } = await req.json();

  if (!taskId || !workspaceId) {
    return NextResponse.json({ error: "Task ID and Workspace ID required" }, { status: 400 });
  }

  await verifyWorkspaceMember(workspaceId, session.id);

  const updateData: any = {};
  if (status !== undefined) updateData.status = status;
  if (order !== undefined) updateData.order = order;
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (priority !== undefined) updateData.priority = priority;
  if (assigneeId !== undefined) updateData.assigneeId = assigneeId;
  if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

  const updatedTask = await db.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      project: true,
      assignee: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  // Record activity if status changed
  if (status !== undefined) {
    await db.activity.create({
      data: {
        workspaceId,
        userId: session.id,
        projectId: updatedTask.projectId,
        action: `changed status to ${status}`,
        target: updatedTask.title,
      },
    });
  }

  return NextResponse.json({ success: true, task: updatedTask });
}
