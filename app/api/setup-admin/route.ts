import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const ADMIN_SECRET = process.env.ADMIN_SETUP_SECRET;

export async function POST(req: NextRequest) {
  const { secret, email, password, name } = await req.json();

  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const existing = await db.user.findUnique({ where: { email } });

    if (existing) {
      const updated = await db.user.update({
        where: { email },
        data: { role: "ADMIN", password: hashedPassword, name: name || existing.name },
      });
      return NextResponse.json({ email: updated.email, role: updated.role, action: "updated" });
    } else {
      const created = await db.user.create({
        data: {
          email,
          name: name || "Admin",
          password: hashedPassword,
          role: "ADMIN",
          emailSent: true,
        },
      });
      return NextResponse.json({ email: created.email, role: created.role, action: "created" });
    }
  } catch (error) {
    console.error("[setup-admin]", error);
    return NextResponse.json({ error: "Setup failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Always return same response to prevent user enumeration
    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("[setup-admin-get]", error);
    return NextResponse.json({ exists: false });
  }
}