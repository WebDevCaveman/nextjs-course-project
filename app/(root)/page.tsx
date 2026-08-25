import QuestionCard from "@/components/cards/QuestionCard";
import { HugeIcon } from "@/components/icons/huge";
import PageFilter from "@/components/filters/PageFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import { getQuestions } from "@/lib/actions/question.action";
import { DataRenderer } from "@/components/DataRenderer";
import { EMPTY_QUESTIONS } from "@/constants/states";
import { homeFilters } from "@/constants";

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

      <PageFilter filters={homeFilters} />

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTIONS}
        render={(data) => data.map((question) => <QuestionCard key={question._id} {...question} />)}
      />
    </>
  );
};

export default Home;
