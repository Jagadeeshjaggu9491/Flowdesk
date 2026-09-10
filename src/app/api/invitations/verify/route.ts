import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const invitation = await db.invitation.findUnique({
    where: { token },
    include: {
      workspace: { select: { name: true, slug: true } },
      invitedBy: { select: { name: true, email: true } },
    },
  });

  if (!invitation || invitation.status !== "PENDING") {
    return NextResponse.json({ error: "Invalid or expired invitation token" }, { status: 400 });
  }

  return NextResponse.json({ invitation });
}
