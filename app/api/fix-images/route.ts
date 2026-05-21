import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

const ADMIN_SECRET = process.env.ADMIN_SETUP_SECRET;

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    const adminSecret = req.headers.get("x-admin-secret");
    if (adminSecret !== ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const updates = [
      { slug: 'ultra-flex-whey-protein', images: ['/products/whey-protein-chocolate-2kg-front.png', '/products/whey-protein-chocolate-2kg-left.png', '/products/whey-protein-chocolate-2kg-right.png'] },
      { slug: 'ultra-core-whey-isolate', images: ['/products/isolate-protein-chocolate-1kg-front.png', '/products/isolate-protein-chocolate-1kg-left.png', '/products/isolate-protein-chocolate-1kg-right.png'] },
      { slug: 'ultrahype-pre-workout', images: ['/products/PreWorkout-Tangy-orange-front.png', '/products/PreWorkout-Tangy-orange-left.png', '/products/PreWorkout-Blueberry-front.png', '/products/PreWorkout-Blueberry-left.png'] },
      { slug: 'ultra-bulk-mass-gainer', images: ['/products/gainer-3kg--alphanso-mango-front.png', '/products/gainer-3kg--alphanso-mango-right.png', '/products/gainer-3kg-chocolate-front.png', '/products/gainer-3kg-chocolate-left.png'] },
    ];

    for (const u of updates) {
      await db.product.update({ where: { slug: u.slug }, data: { images: u.images } });
    }

    return NextResponse.json({ success: true, updated: updates.map(u => u.slug) });
  } catch (error) {
    console.error('[fix-images]', error);
    return NextResponse.json({ error: 'Failed to fix images' }, { status: 500 });
  }
}