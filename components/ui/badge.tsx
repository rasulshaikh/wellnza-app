import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-7 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded border border-[#D6D3D1] px-2 py-0.5 text-[13px] font-medium whitespace-nowrap transition-all focus-visible:border-[#A8A29E] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-[#F5F5EB] text-[#57534E] border-[#D6D3D1] hover:border-[#A8A29E] [a]:hover:bg-[#F5F5EB]/80",
        secondary:
          "bg-[#F5F5EB] text-[#57534E] border-[#D6D3D1] hover:border-[#A8A29E]",
        destructive:
          "bg-[#FEE2E2] text-[#B91C1C] border-[#FEE2E2] hover:border-[#B91C1C]/20",
        outline:
          "border-[#D6D3D1] text-[#57534E] hover:border-[#A8A29E] [a]:hover:bg-[#F5F5EB] [a]:hover:text-[#57534E]",
        ghost:
          "text-[#57534E] hover:bg-[#F5F5EB] hover:text-[#57534E]",
        link: "text-[#166534] underline-offset-4 hover:underline",
        // Filter chip selected state
        "filter-selected": "bg-[#166534] text-white border-[#166534] hover:bg-[#166534]/90",
        // Status chips
        "eco-certified": "bg-[#DCFCE7] text-[#166534] border-[#DCFCE7]",
        "in-stock": "bg-[#DCFCE7] text-[#166534] border-[#DCFCE7]",
        "low-stock": "bg-[#FEF9C3] text-[#CA8A04] border-[#FEF9C3]",
        "out-of-stock": "bg-[#FEE2E2] text-[#B91C1C] border-[#FEE2E2]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
