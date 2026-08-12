import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Theme from "./Theme";

const Navbar = () => {
  return (
    <header className="border-line bg-base sticky top-0 z-40 flex h-[80px] items-center justify-between gap-6 border-b px-6">
      <Link href="/" className="text-fg hover:text-fg flex items-center gap-2.5">
        <Image src="/brand/logo-tile.svg" alt="DevFlow Logo" width={34} height={34} priority />
        <span className="text-xl font-semibold tracking-[-0.5px]">
          Dev<span className="text-accent-solid">Flow</span>
        </span>
      </Link>

      <p>Global Search</p>

      <div className="flex items-center gap-3">
        <Theme />
        <Avatar className="size-[34px]">
          <AvatarFallback>DF</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Navbar;
