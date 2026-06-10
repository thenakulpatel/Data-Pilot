import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `
    group/button
    inline-flex
    items-center
    justify-center
    whitespace-nowrap

    font-medium

    transition-all
    duration-300

    outline-none

    hover:scale-[1.01]
    active:scale-[0.98]

    disabled:pointer-events-none
    disabled:opacity-50

    focus-visible:ring-2
    focus-visible:ring-white/20

    [&_svg]:pointer-events-none
    [&_svg]:shrink-0
    [&_svg:not([class*='size-'])]:size-4
  `,
  {
    variants: {
      variant: {
        default: `
          bg-white/60
          text-black

          border
          border-white/40

          shadow-[0_10px_40px_rgba(255,255,255,0.12)]

          hover:bg-white/90
          hover:shadow-[0_15px_50px_rgba(255,255,255,0.18)]
          hover:-translate-y-0.5
        `,

        outline: `
          border
          border-white/10

          bg-white/[0.05]

          backdrop-blur-2xl

          text-white

          hover:bg-white/[0.08]
          hover:border-white/20

          hover:-translate-y-0.5
        `,

        secondary: `
          bg-white/[0.08]

          text-white

          border
          border-white/10

          backdrop-blur-2xl

          hover:bg-white/[0.12]
          hover:border-white/20

          hover:-translate-y-0.5
        `,

        ghost: `
          text-white

          hover:bg-white/[0.06]
        `,

        destructive: `
          bg-red-500/10

          text-red-300

          border
          border-red-500/20

          backdrop-blur-xl

          hover:bg-red-500/15
          hover:border-red-500/40

          hover:-translate-y-0.5
        `,

        link: `
          text-white

          underline-offset-4

          hover:underline
        `,
      },

      size: {
        default: `
          h-12
          px-8
          rounded-full
          text-[15px]
        `,

        xs: `
          h-8
          px-3
          rounded-full
          text-xs
        `,

        sm: `
          h-10
          px-5
          rounded-full
          text-sm
        `,

        lg: `
          h-14
          px-10
          rounded-full
          text-base
        `,

        icon: `
          size-12
          rounded-full
        `,

        "icon-xs": `
          size-8
          rounded-full
        `,

        "icon-sm": `
          size-10
          rounded-full
        `,

        "icon-lg": `
          size-14
          rounded-full
        `,
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        })
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };