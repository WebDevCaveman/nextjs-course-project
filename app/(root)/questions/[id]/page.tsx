import Metric from "@/components/metric/Metric";
import TagList from "@/components/tag-list/TagList";
import { HugeIcon } from "@/components/icons/huge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/time";
import { notFound, redirect } from "next/navigation";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { after } from "next/server";
import AnswerForm from "@/components/forms/AnswerForm";
import { auth } from "@/auth";
import { StateSkeleton } from "@/components/DataRenderer";
import { DEFAULT_DENIED } from "@/constants/states";
import { getAnswers } from "@/lib/actions/answer.action";
import AllAnswers from "@/components/answers/AllAnswers";
import { CODE_LANGUAGES } from "@/constants";
import { Separator } from "@/components/ui/separator";
import Votes from "@/components/votes/Votes";
import { getAnswerVotes, hasVoted } from "@/lib/actions/vote.action";
import { Suspense } from "react";
import SaveQuestion from "@/components/questions/SaveQuestion";
import { hasSaved } from "@/lib/actions/collection.action";

// W tym przypadku chcemy wywolac dwie funkcje asynchroniczne w tym samym czasie - pobranie pytania i inkrementacja liczby wyswietlen. Moglibysmy zrobic to zwyczajnie zmieniajac kolejnosc i najpierw odpalic incrementViews, a potem getQuestion, ale chcemy zeby pobranie pytania bylo priorytetowe i nie chcemy blokowac wyswietlenia pytania na czas inkrementacji liczby wyswietlen - jest to zle rozwiazanie, ktore wplywa na szybkosc generowania strony. Innym sposobem jest wykorzystanie funkcji after, ktora pozwala na wywolanie funkcji asynchronicznej po tym jak strona zostanie wyrenderowana i wyslana do klienta. Ale to rozwiazanie ma jeden zasadniczy problem, bo ilosc wyswietlen zostanie zaktualizowana dopiero po tym, jak juz wyswietlimy strone. Natomiast jest idealne jesli chcielibysmy podpiac np. analityke i wyslac do niej informacje o wyswietleniu pytania, bo nie blokuje to renderowania strony.
// Dlatego tez w tym przypadku jest wykorzystanie opcji parallel w next.js, ktora pozwala na wywolanie funkcji asynchronicznych w tym samym czasie, bez blokowania renderowania strony. Czyli zarowno inkrementacja, jak i pobranie pytania wykonaja sie na serweerze w tym samym czasie, a my wyswietlimy pytanie od razu zamiast czekac na ikrementacje. To rozwiazanie dodatkowo niweluje problem tzw. waterfall effect, czyli sytuacji, w ktorej jedna funkcja asynchroniczna blokuje wykonanie drugiej - ale tez ma swoje wady.
// Dlatego jesli naszym nadrzednym celem byloby tutaj wyswietlenie pytania zawsze z odpowiednio zaktualizowanym wynikiem wyswietlen to powinnismy to zrobic w ramach jednej funkcji, ktora najpierw zaktualizuje liczbe wyswietlen i dopiero potem pobierze i zwroci nam pytanie.

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, filter } = await searchParams;
  if (!id) notFound();
  const session = await auth();
  const userId = session?.user?.id;

  // Aby skorzystac z parallel wystarczy, ze wywolamy Promise.all z tablica funkcji asynchronicznych, ktore chcemy wykonac w tym samym czasie. Poniewaz nie potrzebujemy wyniku z incrementViews, to mozemy go zignorowac i zostawic puste miejsce w destrukturyzacji tablicy i tylko pobrac wynik z getQuestion.
  // Z parallel mozemy skorzystac tylko wtedy, gdy funkcje asynchroniczne nie sa zalezne od siebie, czyli nie potrzebujemy wyniku jednej funkcji do wywolania drugiej. W tym przypadku nie potrzebujemy wyniku z incrementViews, zeby pobrac pytanie, wiec mozemy je wywolac w tym samym czasie.
  // Musimy tez pamietac o super waznej rzeczy, ze to rozwiazanie wykonuje funkcje niezaleznie od tego w jakiej kolejnosci je przekazemy i nie ma gwarancji, ktora z nich wykona sie pierwsza - domyslnie ta, ktora jest szybsza - co moze oznaczac, ze jesli nasze incrementViews bedzie wolniejsze od getQuestion, to wyswietlenie pytania moze nastapic zanim zostanie zaktualizowana liczba wyswietlen.
  // const [, { data: question, success }] = await Promise.all([
  //   incrementViews({ questionId: id }),
  //   getQuestion({ questionId: id }),
  // ]);

  const { data: question, success } = await getQuestion({ questionId: id });

  if (!success || !question) redirect("/404");

  const {
    success: answersSuccess,
    data: answersData,
    error: answersError,
  } = await getAnswers({
    questionId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter: filter || "latest",
  });

  // Jeden odczyt glosow dla wszystkich odpowiedzi na stronie zamiast jednego zapytania na karte.
  // Swiadomie bez await - promise leci w dol do kart, ktore odbieraja go przez use() pod Suspense,
  // wiec tresc strony renderuje sie od razu, nie czekajac na stan glosow.
  const votesPromise = userId
    ? getAnswerVotes({ answerIds: answersData?.answers.map((answer) => answer._id) ?? [] })
    : undefined;

  // Dlatego ostatecznie korzystamy z after, aby nasza strona wyswietlila sie od razu, a aktulizacja liczby wyswietlen nastapila pozniej - wiec user zobaczy aktualny wynik dopiero po odswiezeniu strony.
  after(async () => {
    await incrementViews({ questionId: id });
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Avatar size="sm">
              <AvatarImage src={question.author.image} alt={question.author.name} />
              <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-base font-medium">{question.author.name}</span>
          </div>

          {userId && (
            <div className="flex items-center gap-2">
              <Suspense fallback={<div>Loading...</div>}>
                <Votes
                  upvotes={question.upvotes}
                  downvotes={question.downvotes}
                  targetType="question"
                  targetId={question._id}
                  hasVotedPromise={hasVoted({ targetId: id, targetType: "question" })}
                />
              </Suspense>
              <Suspense fallback={<div>Loading...</div>}>
                <SaveQuestion questionId={question._id} hasSavedPromise={hasSaved({ questionId: question._id })} />
              </Suspense>
            </div>
          )}
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

      <AllAnswers
        success={answersSuccess}
        error={answersError}
        data={answersData?.answers}
        totalAnswers={answersData?.totalAnswers || 0}
        page={Number(page) || 1}
        isNext={answersData?.isNext || false}
        votesPromise={votesPromise}
      />

      <Separator />

      <section className="flex flex-col gap-6">
        {userId ? (
          <AnswerForm questionId={question._id} questionTitle={question.title} questionContent={question.content} />
        ) : (
          <StateSkeleton
            {...DEFAULT_DENIED}
            title="Please log in to submit an answer."
            message="Create an account or log in to participate in the discussion and share your knowledge with the community."
          />
        )}
      </section>
    </>
  );
};

export default QuestionDetails;
