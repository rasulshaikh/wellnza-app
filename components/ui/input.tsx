import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-[44px] w-full min-w-0 rounded-[8px] border px-3 py-2 text-sm transition-colors outline-none aria-invalid:border-[#B91C1C]",
        className
      )}
      style={{
        borderColor: "rgba(20,83,45,0.15)",
        backgroundColor: "#FFFFFF",
        color: "#1a1a1a",
      }}
      {...props}
    />
  )
}

export { Input }
