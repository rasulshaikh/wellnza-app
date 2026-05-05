import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  
  const ADMIN_SECRET = process.env.ADMIN_SETUP_SECRET;
  const secret = req.headers.get("x-admin-secret");
  
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
    console.error("[create-admin]", error);
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}
