import Link from "next/link";
import { HugeIcon } from "@/components/icons/huge";
import NavLinks from "@/components/navigation/NavLinks";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { auth, signOut } from "@/auth";

const LeftSidebar = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <div className="border-line bg-background sticky top-16 hidden h-[calc(100vh-4rem)] w-[72px] shrink-0 flex-col overflow-y-auto border-r p-2 md:flex xl:w-[266px] xl:p-4">
      <NavLinks userId={userId} />

      {userId ? (
        <form
          className="mt-auto flex flex-col gap-2 pt-4"
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button type="submit" variant="outline" size="rail">
            <HugeIcon name="interface/logout" size={16} />
            <span className="hidden xl:block">Log Out</span>
          </Button>
        </form>
      ) : (
        <div className="mt-auto flex flex-col gap-2 pt-4">
          <Button asChild variant="soft" size="rail">
            <Link href={ROUTES.SIGN_IN}>
              <HugeIcon name="interface/login" size={16} />
              <span className="hidden xl:block">Log In</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="rail">
            <Link href={ROUTES.SIGN_UP}>
              <HugeIcon name="user/user-circle-add" size={16} />
              <span className="hidden xl:block">Sign Up</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
