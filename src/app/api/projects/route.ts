import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyWorkspaceMember } from "@/lib/permissions";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace ID parameter required" }, { status: 400 });
  }

  await verifyWorkspaceMember(workspaceId, session.id);

  const projects = await db.project.findMany({
    where: { workspaceId },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
      },
      tasks: {
        select: { id: true, status: true, priority: true, assigneeId: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workspaceId, name, description, key, color, deadline } = await req.json();

  if (!workspaceId || !name) {
    return NextResponse.json({ error: "Workspace ID and project name required" }, { status: 400 });
  }

  await verifyWorkspaceMember(workspaceId, session.id);

  const projectKey = key || name.substring(0, 3).toUpperCase();

  const project = await db.project.create({
    data: {
      workspaceId,
      name,
      description,
      key: projectKey,
      color: color || "#635BFF",
      deadline: deadline ? new Date(deadline) : null,
    },
  });

  // Assign creator as member
  await db.projectMember.create({
    data: {
      projectId: project.id,
      userId: session.id,
    },
  });

  // Record activity
  await db.activity.create({
    data: {
      workspaceId,
      userId: session.id,
      projectId: project.id,
      action: "created project",
      target: name,
    },
  });

  return NextResponse.json({ success: true, project });
}
