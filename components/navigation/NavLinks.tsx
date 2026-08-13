"use client";

import { links } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";
import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";

const NavLinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {
  const pathname = usePathname();
  const userId = "123"; // Replace with actual

  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, Icon }) => {
        const isActive = href === ROUTES.HOME ? pathname === href : pathname.startsWith(href);
        if (href === ROUTES.PROFILE) {
          if (userId) href = `${ROUTES.PROFILE}/${userId}`;
        }

        const link = (
          <Link
            key={href}
            href={href}
            className={cn(
              "text-md flex h-[52px] items-center gap-4 rounded-lg px-4",
              isActive ? "bg-accent-solid font-semibold text-white" : "text-fg-muted hover:bg-muted font-medium"
            )}
          >
            <Icon size={21} />
            {label}
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
