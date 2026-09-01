import { Suspense } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CODE_LANGUAGES } from "@/constants";
import { formatRelativeTime } from "@/lib/time";
import Votes from "@/components/votes/Votes";
import { HasVotedResponse } from "@/types/action";

interface Props extends Answer {
  // Promise, a nie gotowy wynik - karta nie czeka na stan glosu, tylko oddaje go do use() w Votes.
  // Brak promise'a (gosc) oznacza, ze pasek glosowania w ogole sie nie renderuje.
  hasVotedPromise?: Promise<ActionResponse<HasVotedResponse>>;
}

const AnswerCard = ({ _id, author, content, createdAt, upvotes, downvotes, hasVotedPromise }: Props) => {
  return (
    <article className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <Avatar size="sm">
            <AvatarImage src={author.image} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-accent-solid text-base font-medium">{author.name}</span>
          <span className="text-fg-subtle text-sm">• answered {formatRelativeTime(createdAt)}</span>
        </div>

        {hasVotedPromise && (
          <Suspense fallback={<div>Loading...</div>}>
            <Votes
              upvotes={upvotes}
              downvotes={downvotes}
              targetType="answer"
              targetId={_id}
              hasVotedPromise={hasVotedPromise}
            />
          </Suspense>
        )}
      </div>

      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, subset: CODE_LANGUAGES }]]}
      >
        {content}
      </Markdown>
    </article>
  );
};

export default AnswerCard;
