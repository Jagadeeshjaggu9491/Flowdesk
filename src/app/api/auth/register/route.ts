import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password, companyName } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    // Create User
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    // Create default workspace
    const workspaceName = companyName || `${name}'s Workspace`;
    const slug = `${workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const workspace = await db.workspace.create({
      data: {
        name: workspaceName,
        slug,
      },
    });

    // Add user as OWNER of workspace
    await db.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: "OWNER",
      },
    });

    // Create default subscription
    await db.subscription.create({
      data: {
        workspaceId: workspace.id,
        plan: "FREE",
        status: "ACTIVE",
      },
    });

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isSuperAdmin: user.isSuperAdmin,
    };

    const token = signToken(sessionUser);

    const res = NextResponse.json({ success: true, user: sessionUser, workspaceId: workspace.id });
    res.cookies.set("flowdesk_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
