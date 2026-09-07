import { Suspense } from "react";
import ActionBtns from "../user/ActionBtns";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CODE_LANGUAGES } from "@/constants";
import ROUTES from "@/constants/routes";
import { formatRelativeTime } from "@/lib/time";
import Votes from "@/components/votes/Votes";
import { HasVotedResponse } from "@/types/action";

interface Props extends Answer {
  // Promise, a nie gotowy wynik - karta nie czeka na stan glosu, tylko oddaje go do use() w Votes.
  // Brak promise'a (gosc) oznacza, ze pasek glosowania w ogole sie nie renderuje.
  hasVotedPromise?: Promise<ActionResponse<HasVotedResponse>>;
  lineClamp?: number;
  showActionBtns?: boolean;
}

const CLAMP: Record<number, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
};

const AnswerCard = ({
  _id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
  question,
  hasVotedPromise,
  lineClamp,
  showActionBtns = false,
}: Props) => {
  return (
    <article className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-12">
        <div className="flex items-center gap-1.5">
          <Avatar size="sm">
            <AvatarImage src={author.image} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-accent-solid text-base font-medium">{author.name}</span>
          <span className="text-fg-subtle text-sm">• answered {formatRelativeTime(createdAt)}</span>
        </div>

        <div>
          {showActionBtns ? (
            <ActionBtns type="answer" targetId={_id} />
          ) : hasVotedPromise ? (
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                upvotes={upvotes}
                downvotes={downvotes}
                targetType="answer"
                targetId={_id}
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>
          ) : null}
        </div>
      </div>

      {(() => {
        const body = (
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeHighlight, { detect: true, subset: CODE_LANGUAGES }]]}
          >
            {content}
          </Markdown>
        );
        return lineClamp ? <div className={CLAMP[lineClamp]}>{body}</div> : body;
      })()}

      {/* Tylko lista odpowiedzi na profilu populuje `question`; na stronie pytania
          zostaje samo ObjectId - prawdziwe, ale bez tytulu i bez _id. */}
      {question?.title && (
        <div className="text-fg-subtle mt-4 text-base">
          In response to:{" "}
          <Link href={ROUTES.QUESTION(question._id)} className="text-fg hover:text-accent-solid font-medium">
            {question.title}
          </Link>
        </div>
      )}
    </article>
  );
};

export default AnswerCard;
