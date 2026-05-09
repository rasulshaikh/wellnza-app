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
        <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>Settings</h1>
        <p className="text-sm text-[#7B9E6B]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
          Manage your store settings
        </p>
      </div>

      {/* Coming Soon */}
      <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-[#9CA3AF]" />
        </div>
        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-2" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>
          Settings Coming Soon
        </h2>
        <p className="text-sm text-[#7B9E6B] max-w-md mx-auto" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
          Store settings, shipping configuration, tax settings, and more will be available here.
        </p>
      </div>
    </div>
  );
}
