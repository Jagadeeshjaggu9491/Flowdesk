import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { token, name, password } = await req.json();

    if (!token || !name || !password) {
      return NextResponse.json({ error: "Token, name, and password are required" }, { status: 400 });
    }

    const invitation = await db.invitation.findUnique({
      where: { token },
      include: { workspace: true },
    });

    if (!invitation || invitation.status !== "PENDING") {
      return NextResponse.json({ error: "Invalid or expired invitation token" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    // Create or update user
    let user = await db.user.findUnique({ where: { email: invitation.email } });

    if (!user) {
      user = await db.user.create({
        data: {
          name,
          email: invitation.email,
          passwordHash,
        },
      });
    }

    // Add member to workspace
    await db.workspaceMember.create({
      data: {
        workspaceId: invitation.workspaceId,
        userId: user.id,
        role: invitation.role,
      },
    });

    // Mark invitation ACCEPTED
    await db.invitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" },
    });

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isSuperAdmin: user.isSuperAdmin,
    };

    const jwtToken = signToken(sessionUser);

    const res = NextResponse.json({ success: true, user: sessionUser, workspaceId: invitation.workspaceId });
    res.cookies.set("flowdesk_token", jwtToken, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
