import QuestionCard from "@/components/cards/QuestionCard";
import EmptyState from "@/components/empty-state/EmptyState";
import { HugeIcon } from "@/components/icons/huge";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { filters } from "@/constants";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import { auth } from "@/auth";

const questions: Question[] = [
  {
    _id: "1",
    title: "How to center a div?",
    content: "Probowalem flexboxa i grida, ale element caly czas trzyma sie lewej krawedzi kontenera.",
    tags: [
      { _id: "css", name: "css" },
      { _id: "html", name: "html" },
    ],
    author: { _id: "1", name: "Krzysztof" },
    createdAt: "2023-01-01T00:00:00.000Z",
    upvotes: 12,
    downvotes: 2,
    answers: 2,
    views: 100,
  },
  {
    _id: "2",
    title: "How to use React Query?",
    content: "Nie wiem, kiedy siegac po useQuery, a kiedy po useMutation przy zapisie formularza.",
    tags: [
      { _id: "react", name: "react" },
      { _id: "typescript", name: "typescript" },
    ],
    author: { _id: "2", name: "Anna" },
    createdAt: "2023-01-02T00:00:00.000Z",
    upvotes: 25,
    downvotes: 1,
    answers: 1,
    views: 42,
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}
// const test = async () => {
//   try {
//     return await api.users.getAll();
//   } catch (error) {
//     handleError(error);
//   }
// };

const Home = async ({ searchParams }: SearchParams) => {
  const session = await auth();
  console.log("session", session);
  // Zapis query = "" pozwala nam na ustawienie domyślnej wartości dla query, jeśli nie zostanie przekazana w URL. Dzięki temu unikamy błędów związanych z brakiem wartości i możemy bezpiecznie filtrować pytania. Czyli w przypadku braku wartości wyswietlimy cala domyslna liste pytań. W przeciwnym razie, jeśli query jest obecne, filtrowanie zostanie wykonane na podstawie jego wartości.
  const { query = "", filter } = await searchParams;
  const filteredQuestions = questions
    .filter(
      (question) =>
        question.title.toLowerCase().includes(query?.toLowerCase()) &&
        (filter !== filters[3].value || question.answers === 0)
    )
    .sort((a, b) => {
      switch (filter) {
        case filters[0].value:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case filters[1].value:
          return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
        case filters[2].value:
          return b.answers - a.answers;
        default:
          return 0;
      }
    });

  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4">
        <h1>All Questions</h1>
        <Button variant="cta" size="cta" asChild>
          <Link href={ROUTES.ASK_QUESTION}>
            <HugeIcon name="interface/plus-01" size={16} />
            Ask a Question
          </Link>
        </Button>
      </section>

      <LocalSearch route="/" iconName="search" placeholder="Search questions..." otherClasses="" />

      <HomeFilter />

      {filteredQuestions.length === 0 ? (
        <EmptyState
          image="home"
          title="No questions found"
          description="There are no questions matching this view yet. Be the first to ask one."
        />
      ) : (
        filteredQuestions.map((question) => (
          <Link key={question._id} href={ROUTES.QUESTION(question._id)} className="text-fg hover:text-fg">
            <QuestionCard {...question} />
          </Link>
        ))
      )}
    </>
  );
};

export default Home;
