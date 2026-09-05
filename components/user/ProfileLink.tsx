import Link from "next/link";
import { HugeIcon, HugeIconName } from "../icons/huge";

const ProfileLink = ({ href, iconName, title }: { href?: string; iconName: HugeIconName; title: string }) => {
  return (
    <>
      {href ? (
        <Link href={href} className="flex items-center gap-1.5">
          <HugeIcon name={iconName} size={14} />
          {title}
        </Link>
      ) : (
        <span className="flex items-center gap-1.5">
          <HugeIcon name={iconName} size={14} />
          {title}
        </span>
      )}
    </>
  );
};

export default ProfileLink;
