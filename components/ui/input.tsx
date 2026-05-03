import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-[44px] w-full min-w-0 rounded-[8px] border border-[#D6D3D1] bg-[#FFFFFF] px-3 py-2 text-sm text-[#1C1917] transition-colors outline-none placeholder:text-[#A8A29E] focus:border-[#166534] focus:outline-2 focus:outline-[#166534]/20 disabled:cursor-not-allowed disabled:bg-[#F5F5EB] disabled:opacity-60 aria-invalid:border-[#B91C1C]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
