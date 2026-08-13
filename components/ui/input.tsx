import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full min-w-0 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default:
          "h-14 rounded-xl border border-input bg-background px-4 text-base focus-visible:border-ring disabled:bg-input/50 dark:disabled:bg-input/80",
        auth: "border-line bg-base focus:border-accent-solid h-12 rounded-lg border px-4 text-[15px]",
        unstyled: "h-auto border-0 bg-transparent px-0 shadow-none focus-visible:ring-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Input({
  className,
  type,
  variant = "default",
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return <input type={type} data-slot="input" className={cn(inputVariants({ variant }), className)} {...props} />;
}

export { Input, inputVariants };
