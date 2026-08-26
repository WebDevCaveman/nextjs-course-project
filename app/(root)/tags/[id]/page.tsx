import QuestionCard from "@/components/cards/QuestionCard";
import { DataRenderer } from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTIONS } from "@/constants/states";
import { getTagQuestions } from "@/lib/actions/tag.action";
import { notFound } from "next/navigation";

const TagQuestions = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  if (!id) notFound();

  const { query, page, pageSize } = await searchParams;
  const { success, data, error } = await getTagQuestions({
    tagId: id,
    query: query || "",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  if (!success || !data) notFound();

  const { tag, questions } = data;

  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4">
        <h1>{tag.name.toUpperCase()}</h1>
      </section>

      <LocalSearch route={ROUTES.TAG(id)} iconName="search" placeholder="Search questions..." otherClasses="" />

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

export default TagQuestions;
