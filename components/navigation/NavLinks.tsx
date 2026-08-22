"use client";

import { links } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";
import { HugeIconSvg } from "@/components/icons/huge/HugeIconSvg";
import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";

const NavLinks = ({ isMobileNav = false, userId }: { isMobileNav?: boolean; userId?: string }) => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, icon }) => {
        const isActive = href === ROUTES.HOME ? pathname === href : pathname.startsWith(href);
        if (href === ROUTES.PROFILE) {
          if (userId) href = `${ROUTES.PROFILE}/${userId}`;
        }

        const link = (
          <Link
            key={href}
            href={href}
            className={cn(
              "text-md flex items-center gap-4 rounded-lg",
              isMobileNav
                ? "h-[52px] px-4"
                : "size-[42px] justify-center self-center px-0 xl:h-[52px] xl:w-full xl:justify-start xl:self-stretch xl:px-4",
              isActive ? "bg-accent-solid font-semibold text-white" : "text-fg-muted hover:bg-muted font-medium"
            )}
          >
            <HugeIconSvg icon={icon} size={21} />
            <span className={cn(!isMobileNav && "hidden xl:block")}>{label}</span>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose key={href} asChild>
            {link}
          </SheetClose>
        ) : (
          link
        );
      })}
    </nav>
  );
};

export default NavLinks;
