import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#166534] text-white border-transparent hover:bg-[#14532D] active:bg-[#052E16] font-raleway font-600",
        outline:
          "border-2 border-[#166534] bg-transparent text-[#166534] hover:bg-[#F0FDF4] font-raleway font-600",
        secondary:
          "border-2 border-[#166534] bg-transparent text-[#166534] hover:bg-[#F0FDF4] font-raleway font-600",
        ghost:
          "bg-transparent text-[#166534] border-transparent hover:bg-[#F5F5EB] font-raleway font-600",
        destructive:
          "bg-[#B91C1C] text-white border-transparent hover:bg-[#991B1B] font-raleway font-600",
        link: "text-[#166534] underline-offset-4 hover:underline font-raleway font-600",
      },
      size: {
        default: "h-10 gap-1.5 px-3 rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-8 gap-1 px-2.5 rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-12 gap-2 px-4 rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-10 rounded-lg",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
