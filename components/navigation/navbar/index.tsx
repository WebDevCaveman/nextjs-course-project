import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Theme from "./Theme";
import MobileNavigation from "./MobileNavigation";
import { auth } from "@/auth";
import ROUTES from "@/constants/routes";

const Navbar = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const name = session?.user?.name;
  const initials = name
    ?.trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatar = (
    <Avatar className="border-line size-8.5 border">
      <AvatarImage src={session?.user?.image ?? undefined} alt={name ?? "User avatar"} />
      <AvatarFallback>{initials || "DF"}</AvatarFallback>
    </Avatar>
  );

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
        {userId ? (
          <Link href={ROUTES.PROFILE(userId)} aria-label="Your profile">
            {avatar}
          </Link>
        ) : (
          avatar
        )}
        <MobileNavigation userId={userId} />
      </div>
    </header>
  );
};

export default Navbar;
