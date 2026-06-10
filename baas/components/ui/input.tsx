import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        `
        h-14
        w-full

        rounded-2xl

        border
        border-white/10

        bg-white/[0.05]

        backdrop-blur-2xl

        px-5

        text-[15px]
        text-white

        shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]

        placeholder:text-white/35

        transition-all
        duration-300

        focus:outline-none

        focus:border-white/20

        focus:bg-white/[0.08]

        focus:shadow-[0_0_0_4px_rgba(255,255,255,0.05)]

        disabled:pointer-events-none
        disabled:opacity-50
        `,
        className
      )}
      {...props}
    />
  );
}

export { Input };