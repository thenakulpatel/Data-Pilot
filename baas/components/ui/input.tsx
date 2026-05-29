import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-full",
        "glass-input",
        "px-5",
        "text-sm text-white",

        "placeholder:text-white",

        "transition-all duration-200",

        "focus-visible:outline-none",
        "focus-visible:ring-4",
        "focus-visible:ring-black/[0.04]",

        "disabled:pointer-events-none",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50", className
      )}
      {...props}
    />
  )
}

export { Input }
