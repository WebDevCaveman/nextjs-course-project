import Metric from "@/components/metric/Metric";
import TagList from "@/components/tag-list/TagList";
import { HugeIcon } from "@/components/icons/huge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/time";

// ponytail: dane na sztywno, do podmiany na pobranie pytania po params.id
const question = {
  title:
    "How to refresh all the data inside the Datatable and move the data into original place after closing the modal popup close button",
  author: { _id: "1", name: "Satheesh" } as Author,
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  votes: 1200,
  answers: 900,
  views: 5200,
  tags: [
    { _id: "javascript", name: "javascript" },
    { _id: "reactjs", name: "react.js" },
    { _id: "invalid-fields", name: "invalid fields" },
    { _id: "deployment", name: "deployment" },
  ] as Tag[],
  content: [
    'When the user clicks a button for the first time, a spinner is displayed, the "close" button is disabled, and a modal popup is shown. When the user clicks on a table displayed within the modal popup, the table loads data.',
    'When the user closes the popup by clicking the "close" button, and then clicks the same button again without refreshing the page, the data in the table should be the same as it was before.',
    "I need it so that when the user clicks the button, any changes made stay in place even after closing and reopening the popup.",
  ],
  code: `$(document).ready(function () {
    var enabledExportCount = 5000;
    $("#partsLibSearchModal").on("show.bs.modal", function (e) {
        $('#partsLibSearchFilter').val('');
        $('#partsLibBigSearch thead tr').clone().attr('id', 'filterrow').appendTo('#partsLibBigSearch thead');
        $("#filterrow th").each(function () {
            $(this).removeClass();
        });
    });
});`,
};

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
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
          <Metric number={question.votes} type="votes" />
          <Metric number={question.answers} type="answers" />
          <Metric number={question.views} type="views" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {question.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <pre className="overflow-x-auto">{question.code}</pre>
      </div>

      <TagList tags={question.tags} inline />
    </>
  );
};

export default QuestionDetails;
