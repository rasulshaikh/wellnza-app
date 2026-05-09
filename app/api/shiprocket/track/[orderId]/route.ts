import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { trackShipmentByAWB } from "@/lib/shiprocket";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;

    const order = await db.order.findUnique({
      where: { id: orderId, userId: session.user.id },
      select: { trackingNumber: true, trackingCarrier: true, status: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.trackingNumber) {
      return NextResponse.json(
        { error: "No tracking available yet" },
        { status: 404 }
      );
    }

    const tracking = await trackShipmentByAWB(order.trackingNumber);
    return NextResponse.json({ tracking, orderStatus: order.status });
  } catch (error) {
    console.error("[shiprocket-track] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tracking" },
      { status: 500 }
    );
  }
}
