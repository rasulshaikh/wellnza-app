import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A0A0A]">Settings</h1>
        <p className="text-sm text-[#6B7280]">
          Manage your store settings
        </p>
      </div>

      {/* Coming Soon */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-[#9CA3AF]" />
        </div>
        <h2 className="text-lg font-semibold text-[#0A0A0A] mb-2">
          Settings Coming Soon
        </h2>
        <p className="text-sm text-[#6B7280] max-w-md mx-auto">
          Store settings, shipping configuration, tax settings, and more will be available here.
        </p>
      </div>
    </div>
  );
}
