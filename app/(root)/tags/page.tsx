import TagCard from "@/components/cards/TagCard";
import PageFilter from "@/components/filters/PageFilter";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { getTags } from "@/lib/actions/tag.action";
import { DataRenderer } from "@/components/DataRenderer";
import { EMPTY_TAGS } from "@/constants/states";
import { tagsFilters } from "@/constants";
import Pagination from "@/components/pagination/Pagination";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Tags = async ({ searchParams }: SearchParams) => {
  const { query, filter, page, pageSize } = await searchParams;
  const { success, data, error } = await getTags({
    query: query || "",
    filter: filter || "",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const { tags, isNext } = data || {};

  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4">
        <h1>Tags</h1>
      </section>

      <LocalSearch route={ROUTES.TAGS} iconName="search" placeholder="Search by tag name..." otherClasses="" />

      <PageFilter filters={tagsFilters} />

      <DataRenderer
        success={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
        render={(data) => (
          <div className="flex flex-col gap-10">
            <section className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
              {data.map((tag) => (
                <TagCard key={tag._id} {...tag} />
              ))}
            </section>
            <Pagination page={page} isNext={isNext || false} />
          </div>
        )}
      />
    </>
  );
};

export default Tags;
