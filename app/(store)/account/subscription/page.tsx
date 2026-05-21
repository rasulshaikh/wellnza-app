import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowLeft } from "lucide-react";

export default async function SubscriptionPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/subscription");
  }

  return (
    <div className="min-h-screen py-8" style={{ background: "#FAFAF8" }}>
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm mb-6" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
          <ArrowLeft className="w-4 h-4" style={{ color: "#14532D" }} />
          Back to Account
        </Link>

        <div className="bg-white border p-6" style={{ borderColor: "rgba(20,83,45,0.15)" }}>
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6" style={{ color: "#14532D" }} />
            <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>Subscriptions</h1>
          </div>

          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 mx-auto mb-4" style={{ color: "#7B9E6B" }} />
            <h2 className="text-lg font-medium mb-2" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>No Active Subscriptions</h2>
            <p className="mb-6" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
              You don&apos;t have any recurring subscriptions at the moment.
            </p>
            <Link href="/products">
              <Button className="text-white" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", background: "#14532D" }}>
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
