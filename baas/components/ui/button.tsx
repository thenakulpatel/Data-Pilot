import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] hover:scale-[1.01]",

        outline:
          "glass-panel text-foreground",

        secondary:
          "bg-white/50 backdrop-blur-xl text-foreground",

        ghost:
          "hover:bg-white/30",

        destructive:
          "bg-destructive text-white",

        link:
          "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 rounded-full",

        xs: "h-8 px-3 rounded-full",

        sm: "h-10 px-4 rounded-full",

        lg: "h-14 px-8 rounded-full",

        icon: "size-12 rounded-full",

        "icon-xs": "size-8 rounded-full",

        "icon-sm": "size-10 rounded-full",

        "icon-lg": "size-14 rounded-full",
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
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
