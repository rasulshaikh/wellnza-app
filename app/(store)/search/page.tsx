import { Suspense } from "react";
import { SearchContent } from "./_components/SearchContent";

export const metadata = {
  title: "Search — Well NZ Nutrition",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}
