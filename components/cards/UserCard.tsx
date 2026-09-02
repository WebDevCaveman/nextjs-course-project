import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ROUTES from "@/constants/routes";
import TagList from "@/components/tag-list/TagList";

// ponytail: tagi zamockowane - docelowo najczestsze tagi uzytkownika liczone w akcji getUsers
const MOCK_TAGS: Tag[] = [
  { _id: "typescript", name: "typescript" },
  { _id: "react", name: "react" },
  { _id: "mongodb", name: "mongodb" },
];

const UserCard = ({ _id, name, username, image }: User) => {
  return (
    <article className="border-line bg-background shadow-card hover:border-accent-solid flex flex-col items-center gap-3.5 rounded-xl border p-5 text-center md:p-9">
      <Link href={ROUTES.PROFILE(_id)} className="text-fg flex flex-col items-center gap-3.5">
        <Avatar className="size-[100px]">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="text-lg">{name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1">
          <h3>{name}</h3>
          <p className="text-fg-subtle text-sm">@{username}</p>
        </div>
      </Link>

      <TagList tags={MOCK_TAGS} inline className="justify-center" />
    </article>
  );
};

export default UserCard;
