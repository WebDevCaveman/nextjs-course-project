import Metric from "@/components/metric/Metric";
import TagList from "@/components/tag-list/TagList";
import { HugeIcon } from "@/components/icons/huge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/time";
import { notFound } from "next/navigation";
import { getQuestion } from "@/lib/actions/question.action";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

// Bloki wstawione w edytorze jako "Plain text" nie maja jezyka w markdownie, wiec
// rehype-highlight domyslnie ich nie koloruje. Detekcja ograniczona do jezykow, ktore
// oferuje edytor - bez tego zawezenia highlight.js zgaduje np. ini albo scss i myli sie.
const CODE_LANGUAGES = ["javascript", "typescript", "xml", "css", "json", "python", "sql", "bash"];

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) notFound();

  const { data: question, success } = await getQuestion({ questionId: id });

  if (!success || !question) notFound();

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1.5">
          <Avatar size="sm">
            <AvatarImage src={question.author.image} alt={question.author.name} />
            <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-base font-medium">{question.author.name}</span>
        </div>

        <h1>{question.title}</h1>

        <div className="text-fg-subtle flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <HugeIcon name="interface/clock-circle" size={16} className="text-accent-solid" />
            Asked {formatRelativeTime(question.createdAt)}
          </span>
          <Metric number={question.upvotes - question.downvotes} type="votes" />
          <Metric number={question.answers} type="answers" />
          <Metric number={question.views} type="views" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[[rehypeHighlight, { detect: true, subset: CODE_LANGUAGES }]]}
        >
          {question.content}
        </Markdown>
      </div>

      <TagList tags={question.tags} inline />
    </>
  );
};

export default QuestionDetails;
