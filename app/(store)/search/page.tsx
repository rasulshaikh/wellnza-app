import { Suspense } from "react";
import { SearchContent } from "./_components/SearchContent";

export const metadata = {
  title: "Search — Wellnza Nutrition",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <p className="text-[#888888]">Loading...</p>
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}
