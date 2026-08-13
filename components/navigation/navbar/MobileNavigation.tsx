import Image from "next/image";
import Link from "next/link";

import { HugeIcon } from "@/components/devflow/icons/huge";
import NavLinks from "@/components/navigation/NavLinks";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ROUTES from "@/constants/routes";

const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="icon" size="icon" aria-label="Open navigation">
          <HugeIcon name="menu/menu-user" size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[304px] sm:max-w-[304px]">
        <SheetHeader>
          <SheetTitle asChild>
            <Link href={ROUTES.HOME} className="text-fg hover:text-fg flex items-center gap-2.5">
              <span className="flex size-7.5 items-center justify-center rounded-[9px] bg-(image:--accent-grad)">
                <Image
                  src="/brand/logo-mark.svg"
                  alt="DevFlow Logo"
                  width={16}
                  height={16}
                  className="brightness-0 invert"
                />
              </span>
              <span className="text-[17px] font-semibold tracking-[-0.5px]">
                Dev<span className="text-accent-solid">Flow</span>
              </span>
            </Link>
          </SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>

        <div className="px-4">
          <NavLinks isMobileNav />
        </div>

        <SheetFooter>
          <Button asChild variant="soft">
            <Link href={ROUTES.SIGN_IN}>
              <HugeIcon name="interface/login" size={16} />
              Log In
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.SIGN_UP}>
              <HugeIcon name="user/user-circle-add" size={16} />
              Sign Up
            </Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
