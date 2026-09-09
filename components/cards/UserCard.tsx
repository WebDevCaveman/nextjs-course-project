import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ROUTES from "@/constants/routes";
import TagList from "@/components/tag-list/TagList";
import { getUserTags } from "@/lib/actions/user.action";

const UserCard = async ({ _id, name, username, image }: User) => {
  const { data } = await getUserTags({ userId: _id });
  const tags = data?.tags.slice(0, 3) ?? [];

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

      <TagList tags={tags} inline size="sm" className="justify-center" />
    </article>
  );
};

export default UserCard;
