import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ProfileLink from "./ProfileLink";
import Link from "next/link";
import ROUTES from "@/constants/routes";

const ProfileHeader = ({ user, isOwnProfile }: { user: User; isOwnProfile?: boolean }) => {
  const { name, username, image, bio, portfolio, location, createdAt } = user;

  return (
    <section className="flex flex-col items-start gap-6 sm:flex-row sm:gap-8">
      <Avatar className="size-[110px] shrink-0 lg:size-[180px]">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback className="text-2xl">{name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1>{name}</h1>
          <p className="text-fg-subtle">@{username}</p>
        </div>

        <div className="text-fg-subtle flex flex-wrap items-center gap-4 text-sm">
          {portfolio && <ProfileLink href={portfolio} iconName="editor/link" title={portfolio} />}

          {location && <ProfileLink iconName="interface/location-01" title={location} />}

          <ProfileLink iconName="interface/calendar" title={`Joined ${dayjs(createdAt).format("MMMM YYYY")}`} />
        </div>

        {bio && <p>{bio}</p>}
      </div>

      {isOwnProfile && (
        <Link href={ROUTES.PROFILE_EDIT}>
          <Button variant="outline">Edit Profile</Button>
        </Link>
      )}
    </section>
  );
};

export default ProfileHeader;
