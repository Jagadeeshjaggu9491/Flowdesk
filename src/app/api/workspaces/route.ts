import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const memberships = await db.workspaceMember.findMany({
    where: { userId: session.id },
    include: {
      workspace: {
        include: {
          members: {
            include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          },
          projects: true,
          subscriptions: true,
        },
      },
    },
  });

  return NextResponse.json({ workspaces: memberships.map((m) => ({ ...m.workspace, userRole: m.role })) });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, industry, description } = await req.json();
  if (!name) return NextResponse.json({ error: "Workspace name is required" }, { status: 400 });

  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.floor(1000 + Math.random() * 9000)}`;

  const workspace = await db.workspace.create({
    data: {
      name,
      slug,
      industry,
      description,
    },
  });

  await db.workspaceMember.create({
    data: {
      workspaceId: workspace.id,
      userId: session.id,
      role: "OWNER",
    },
  });

  await db.subscription.create({
    data: {
      workspaceId: workspace.id,
      plan: "FREE",
      status: "ACTIVE",
    },
  });

  return NextResponse.json({ success: true, workspace });
}
