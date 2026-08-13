import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent bg-clip-padding text-sm font-semibold tracking-[-0.1px] whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[var(--bg-disabled)] disabled:text-[var(--text-disabled)] aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        cta: "bg-[image:var(--accent-grad)] text-white shadow-[0_6px_16px_color-mix(in_srgb,var(--red-500)_26%,transparent)] hover:brightness-[1.03]",
        primary: "bg-accent-solid text-white hover:bg-accent-fg",
        outline: "border-line-strong bg-base text-fg hover:bg-subtle",
        soft: "bg-accent-soft text-accent-solid hover:bg-accent-solid hover:text-white",
        ghost: "bg-transparent font-medium text-fg-muted hover:bg-muted hover:text-fg",
        icon: "border-line bg-subtle text-[var(--icon-secondary)]",
      },
      size: {
        cta: "h-[45px] rounded-[11px] px-[18px] text-base",
        auth: "h-[45px] rounded-lg px-[18px] text-base",
        md: "h-[42px] rounded-md px-[22px] text-base",
        sm: "h-[38px] rounded-md px-[15px] text-sm",
        icon: "size-[34px] justify-center rounded-md px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

function Button({
  className,
  variant = "primary",
  size = "md",
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
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
