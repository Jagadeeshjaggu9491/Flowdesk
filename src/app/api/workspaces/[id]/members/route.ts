import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { requireWorkspaceRole, verifyWorkspaceMember } from "@/lib/permissions";
import { sendInvitationEmail } from "@/lib/services/email";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: workspaceId } = await params;
    await verifyWorkspaceMember(workspaceId, session.id);

    const members = await db.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            jobTitle: true,
            createdAt: true,
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    });

    const invitations = await db.invitation.findMany({
      where: { workspaceId, status: "PENDING" },
      include: { invitedBy: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ members, invitations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load team" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: workspaceId } = await params;
    const { email, role } = await req.json();

    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await requireWorkspaceRole(workspaceId, session.id, "ADMIN");

    const workspace = await db.workspace.findUnique({ where: { id: workspaceId } });
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Check if user already exists in DB
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      const existingMember = await db.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId: existingUser.id } },
      });
      if (existingMember) {
        return NextResponse.json({ error: "User is already a workspace member" }, { status: 400 });
      }

      // Add to workspace directly
      const member = await db.workspaceMember.create({
        data: {
          workspaceId,
          userId: existingUser.id,
          role: role || "MEMBER",
        },
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true, jobTitle: true } },
        },
      });

      // Send Notification email to existing user
      const inviteUrl = `${appUrl}/dashboard`;
      await sendInvitationEmail({
        to: email,
        workspaceName: workspace.name,
        inviterName: session.name,
        inviteUrl,
      });

      return NextResponse.json({ success: true, member, invited: false, inviteUrl });
    }

    // Create Invitation token and link
    const token = `inv_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const invitation = await db.invitation.create({
      data: {
        workspaceId,
        email,
        role: role || "MEMBER",
        token,
        invitedById: session.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const inviteUrl = `${appUrl}/accept-invite?token=${token}`;

    // Dispatch Invitation Email via Email Service
    await sendInvitationEmail({
      to: email,
      workspaceName: workspace.name,
      inviterName: session.name,
      inviteUrl,
    });

    return NextResponse.json({ success: true, invitation, invited: true, inviteUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process invitation" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: workspaceId } = await params;
    const { memberId, role } = await req.json();

    await requireWorkspaceRole(workspaceId, session.id, "ADMIN");

    const updatedMember = await db.workspaceMember.update({
      where: { id: memberId },
      data: { role },
    });

    return NextResponse.json({ success: true, member: updatedMember });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update role" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: workspaceId } = await params;
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) return NextResponse.json({ error: "Member ID required" }, { status: 400 });

    await requireWorkspaceRole(workspaceId, session.id, "ADMIN");

    await db.workspaceMember.delete({ where: { id: memberId } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to remove member" }, { status: 500 });
  }
}
