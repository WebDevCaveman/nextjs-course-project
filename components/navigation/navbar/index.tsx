import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Theme from "./Theme";
import MobileNavigation from "./MobileNavigation";

const Navbar = () => {
  return (
    <header className="border-line bg-background sticky top-0 z-40 flex h-16 items-center justify-between gap-6 border-b px-6">
      <Link href="/" className="text-fg hover:text-fg flex items-center gap-2.5">
        <span className="flex size-7.5 items-center justify-center rounded-[9px] bg-(image:--accent-grad)">
          <Image
            src="/brand/logo-mark.svg"
            alt="DevFlow Logo"
            width={16}
            height={16}
            className="brightness-0 invert"
            priority
          />
        </span>
        <span className="text-[17px] font-semibold tracking-[-0.5px] max-[360px]:hidden">
          Dev<span className="text-accent-solid">Flow</span>
        </span>
      </Link>

      <p>Global Search</p>

      <div className="flex items-center gap-3">
        <Theme />
        <Avatar className="border-line size-8.5 border">
          <AvatarFallback>DF</AvatarFallback>
        </Avatar>
        <MobileNavigation />
      </div>
    </header>
  );
};

export default Navbar;
