import { NextResponse } from "next/server";
import { generateAutoDescription } from "@/lib/services/aiGenerator";

export async function POST(req: Request) {
  try {
    const { title, type } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required for auto-generation" }, { status: 400 });
    }

    const description = generateAutoDescription(title, type || "task");

    return NextResponse.json({ success: true, description });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate description" }, { status: 500 });
  }
}
