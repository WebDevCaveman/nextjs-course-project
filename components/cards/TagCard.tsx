import { HugeIcon } from "@/components/icons/huge";
import ROUTES from "@/constants/routes";
import { tagIcon } from "@/lib/devicon";
import { tagDescription } from "@/lib/tag-description";
import Link from "next/link";

const TagCard = ({ _id, name, questions }: Tag) => {
  const icon = tagIcon(name);

  return (
    <article className="border-line bg-background shadow-card hover:border-accent-solid flex flex-col gap-3.5 rounded-xl border p-5 md:p-9">
      <Link
        href={ROUTES.TAG(_id)}
        className="bg-muted text-fg inline-flex w-fit items-center gap-2 rounded-sm px-5 py-2 text-base font-semibold"
      >
        {icon ? <i className={`${icon} text-[20px]`} /> : <HugeIcon name="ecommerce/tag" size={20} />}
        {name.toUpperCase()}
      </Link>

      <p className="line-clamp-2 text-sm">{tagDescription(name)}</p>

      {questions !== undefined && (
        <p className="text-accent-solid text-sm font-semibold">
          {questions} <span className="text-fg-subtle font-normal">{questions === 1 ? "Question" : "Questions"}</span>
        </p>
      )}
    </article>
  );
};

export default TagCard;
