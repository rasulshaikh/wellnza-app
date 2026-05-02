import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json({ maxBytes: 1024 });
    const { email } = body;

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Log for now — connect to email provider later
    console.log("[newsletter] new subscriber:", email);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
