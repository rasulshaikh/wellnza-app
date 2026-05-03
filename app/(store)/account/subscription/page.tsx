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
    <div className="min-h-screen bg-[#FAFAF7] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#1C1C1C] mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <div className="bg-white border border-[#E5E5E0] p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-[#0055FF]" />
            <h1 className="text-xl font-bold text-[#1C1C1C]">Subscriptions</h1>
          </div>

          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-[#CCCCCC] mx-auto mb-4" />
            <h2 className="text-lg font-medium text-[#1C1C1C] mb-2">No Active Subscriptions</h2>
            <p className="text-[#6B6B6B] mb-6">
              You don&apos;t have any recurring subscriptions at the moment.
            </p>
            <Link href="/products">
              <Button className="bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
