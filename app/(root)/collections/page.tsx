import QuestionCard from "@/components/cards/QuestionCard";
import { DataRenderer } from "@/components/DataRenderer";
import PageFilter from "@/components/filters/PageFilter";
import Pagination from "@/components/pagination/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { collectionsFilters } from "@/constants";
import ROUTES from "@/constants/routes";
import { EMPTY_COLLECTIONS } from "@/constants/states";
import { getSavedQuestions } from "@/lib/actions/collection.action";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Collections = async ({ searchParams }: SearchParams) => {
  const { query, filter, page, pageSize } = await searchParams;
  const { success, data, error } = await getSavedQuestions({
    query: query || "",
    filter: filter || "",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const { collections, isNext } = data || {};

  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4">
        <h1>Saved Questions</h1>
      </section>

      <LocalSearch
        route={ROUTES.COLLECTIONS}
        iconName="search"
        placeholder="Search for questions here..."
        otherClasses=""
      />

      <PageFilter filters={collectionsFilters} />

      <DataRenderer
        success={success}
        error={error}
        data={collections}
        empty={EMPTY_COLLECTIONS}
        render={(collections) => (
          <div className="flex flex-col gap-10">
            <section className="grid gap-10 min-[1920px]:grid-cols-2">
              {collections.map(({ question }) => (
                <QuestionCard key={question._id} {...question} />
              ))}
            </section>
            <Pagination page={page} isNext={isNext || false} />
          </div>
        )}
      />
    </>
  );
};

export default Collections;
