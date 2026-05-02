import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const PHONE_REGEX = /^[6-9]\d{9}$/;
const PIN_REGEX = /^[1-9]\d{5}$/;

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(addresses);
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, phone, line1, line2, city, state, pin, country, isDefault } = body;

    if (!name?.trim() || !phone || !line1?.trim() || !city?.trim() || !state?.trim() || !pin) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!PHONE_REGEX.test(phone)) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }
    if (!PIN_REGEX.test(pin)) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 400 });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await db.address.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        phone,
        line1: line1.trim(),
        line2: line2?.trim() || null,
        city: city.trim(),
        state: state.trim(),
        pin,
        country: country || "India",
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}
