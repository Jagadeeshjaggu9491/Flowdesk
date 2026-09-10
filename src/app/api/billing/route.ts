import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { requireWorkspaceRole } from "@/lib/permissions";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });

  const subscription = await db.subscription.findUnique({
    where: { workspaceId },
    include: { payments: { orderBy: { createdAt: "desc" } } },
  });

  return NextResponse.json({ subscription });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workspaceId, plan } = await req.json();

  if (!workspaceId || !plan) {
    return NextResponse.json({ error: "Workspace ID and Plan required" }, { status: 400 });
  }

  await requireWorkspaceRole(workspaceId, session.id, "ADMIN");

  const amountMap: Record<string, number> = {
    FREE: 0,
    PRO: 12,
    BUSINESS: 29,
  };

  const subscription = await db.subscription.upsert({
    where: { workspaceId },
    update: { plan, status: "ACTIVE" },
    create: { workspaceId, plan, status: "ACTIVE" },
  });

  if (amountMap[plan] > 0) {
    await db.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: amountMap[plan],
        currency: "USD",
        status: "SUCCEEDED",
      },
    });
  }

  return NextResponse.json({ success: true, subscription });
}
