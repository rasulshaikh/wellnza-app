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
    console.error("[setup-admin]", String(error), error instanceof Error ? error.message : String(error), Object.keys(error || {}));
    return NextResponse.json({ error: "Setup failed", detail: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const adminEmail = "admin@wellnzanutrition.com";
    const admin = await db.user.findUnique({ where: { email: adminEmail } });
    if (!admin) {
      return NextResponse.json({ exists: false });
    }
    return NextResponse.json({
      exists: true,
      email: admin.email,
      role: admin.role,
      hasPassword: !!admin.password,
      createdAt: admin.createdAt,
    });
  } catch (error) {
    console.error("[setup-admin-get]", String(error), error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Check failed", detail: String(error) }, { status: 500 });
  }
}