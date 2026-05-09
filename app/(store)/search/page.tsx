import { Suspense } from "react";
import { SearchContent } from "./_components/SearchContent";

export const metadata = {
  title: "Search — Wellnza Nutrition",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <p style={{ color: "#7B9E6B" }}>Loading...</p>
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}
