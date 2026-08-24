import QuestionCard from "@/components/cards/QuestionCard";
import EmptyState from "@/components/empty-state/EmptyState";
import Error from "@/components/error/Error";
import { HugeIcon } from "@/components/icons/huge";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import { getQuestions } from "@/lib/actions/question.action";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  const { query, filter, page, pageSize } = await searchParams;
  const { success, data, error } = await getQuestions({
    query: query || "",
    filter: filter || "",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const { questions } = data || {};

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

      {success ? (
        questions && questions.length > 0 ? (
          questions.map((question) => (
            <Link key={question._id} href={ROUTES.QUESTION(question._id)} className="text-fg hover:text-fg">
              <QuestionCard {...question} />
            </Link>
          ))
        ) : (
          <EmptyState
            image="home"
            title="No questions found"
            description="There are no questions matching this view yet. Be the first to ask one."
          />
        )
      ) : (
        <Error image="collections" title="Error" description={error?.message || "Failed to fetch questions."} />
      )}
    </>
  );
};

export default Home;
