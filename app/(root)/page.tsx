import EmptyState from "@/components/empty-state/EmptyState";
import { HugeIcon } from "@/components/icons/huge";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { filters } from "@/constants";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const questions = [
  {
    id: "1",
    title: "How to center a div?",
    tags: ["css", "html"],
    author: "Krzysztof",
    createdAt: new Date("2023-01-01").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    votes: 10,
    answers: 2,
    views: 100,
  },
  {
    id: "2",
    title: "How to use React Query?",
    tags: ["react", "typescript"],
    author: "Anna",
    createdAt: new Date("2023-01-02").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    votes: 24,
    answers: 1,
    views: 42,
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
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
          return b.votes - a.votes;
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
          <article
            key={question.id}
            className="border-line bg-background shadow-card hover:border-accent-solid flex flex-col gap-6 rounded-xl border p-5 md:p-9"
          >
            <h2>{question.title}</h2>

            <ul className="flex list-none flex-row flex-wrap gap-2 pl-0">
              {question.tags.map((tag) => (
                <li
                  key={tag}
                  className="bg-muted text-fg-subtle inline-flex h-[29px] items-center rounded-md px-4 text-[10px] font-semibold tracking-[0.04em] uppercase"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <footer className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-medium">{question.author}</span>
                <span className="text-fg-subtle text-sm">• asked {question.createdAt}</span>
              </div>
              <div className="text-fg-subtle flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">{question.votes} Votes</span>
                <span className="flex items-center gap-1.5">{question.answers} Answers</span>
                <span className="flex items-center gap-1.5">{question.views} Views</span>
              </div>
            </footer>
          </article>
        ))
      )}
    </>
  );
};

export default Home;
