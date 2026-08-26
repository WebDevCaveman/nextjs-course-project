import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CODE_LANGUAGES } from "@/constants";
import { formatRelativeTime } from "@/lib/time";

const AnswerCard = ({ author, content, createdAt }: Answer) => {
  return (
    <article className="flex flex-col gap-6">
      <div className="flex items-center gap-1.5">
        <Avatar size="sm">
          <AvatarImage src={author.image} alt={author.name} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-accent-solid text-base font-medium">{author.name}</span>
        <span className="text-fg-subtle text-sm">• answered {formatRelativeTime(createdAt)}</span>
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
