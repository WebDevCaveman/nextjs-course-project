"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { HugeIconSvg } from "@/components/icons/huge/HugeIconSvg";
import { uiIcons } from "@/components/icons/huge/data/ui";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <HugeIconSvg icon={uiIcons.checkCircle} size={16} className="size-4" />,
        info: <HugeIconSvg icon={uiIcons.info} size={16} className="size-4" />,
        warning: <HugeIconSvg icon={uiIcons.warning} size={16} className="size-4" />,
        error: <HugeIconSvg icon={uiIcons.error} size={16} className="size-4" />,
        loading: <HugeIconSvg icon={uiIcons.loading} size={16} className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
