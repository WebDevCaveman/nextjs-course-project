"use client";

import { useTheme } from "next-themes";
import { HugeIconSvg } from "@/components/icons/huge/HugeIconSvg";
import { uiIcons } from "@/components/icons/huge/data/ui";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Theme = () => {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="icon" size="icon" aria-label="Zmień motyw">
          <HugeIconSvg icon={uiIcons.sun} size={16} className="size-4 dark:hidden" />
          <HugeIconSvg icon={uiIcons.moon} size={16} className="hidden size-4 dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">
            <HugeIconSvg icon={uiIcons.sun} size={16} />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <HugeIconSvg icon={uiIcons.moon} size={16} />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <HugeIconSvg icon={uiIcons.monitor} size={16} />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Theme;
