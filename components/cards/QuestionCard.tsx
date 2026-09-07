import Metric from "@/components/metric/Metric";
import TagList from "@/components/tag-list/TagList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/time";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import ActionBtns from "../user/ActionBtns";

interface QuestionCardProps extends Question {
  showActionBtns?: boolean;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  createdAt,
  upvotes,
  downvotes,
  answers,
  views,
  showActionBtns = false,
}: QuestionCardProps) => {
  return (
    <article className="border-line bg-background shadow-card hover:border-accent-solid flex flex-col gap-6 rounded-xl border p-5 md:p-9">
      <div className="flex items-center justify-between gap-12">
        <h2>
          <Link href={ROUTES.QUESTION(_id)} className="text-fg hover:text-accent-solid">
            {title}
          </Link>
        </h2>
        {showActionBtns && <ActionBtns type="question" targetId={_id} />}
      </div>

      <TagList tags={tags} inline />

      <footer className="flex flex-wrap items-center justify-between gap-4">
        <div className="hover:text-accent-solid flex items-center gap-1.5">
          <Avatar size="xs">
            <AvatarImage src={author.image} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-base font-medium">{author.name}</span>
          <span className="text-fg-subtle text-sm">• asked {formatRelativeTime(createdAt)}</span>
        </div>

        <div className="text-fg-subtle flex items-center gap-4 text-sm">
          <Metric number={upvotes - downvotes} type="votes" />
          <Metric number={answers} type="answers" />
          <Metric number={views} type="views" />
        </div>
      </footer>
    </article>
  );
};

export default QuestionCard;
