import UserCard from "@/components/cards/UserCard";
import { DataRenderer } from "@/components/DataRenderer";
import PageFilter from "@/components/filters/PageFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { usersFilters } from "@/constants";
import ROUTES from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/states";
import { getUsers } from "@/lib/actions/user.action";
import Pagination from "@/components/pagination/Pagination";
interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Community = async ({ searchParams }: SearchParams) => {
  const { query, filter, page, pageSize } = await searchParams;
  const { success, data, error } = await getUsers({
    query: query || "",
    filter: filter || "",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const { users, isNext } = data || {};

  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4">
        <h1>All Users</h1>
      </section>

      <LocalSearch route={ROUTES.COMMUNITY} iconName="search" placeholder="Search amazing minds..." otherClasses="" />

      <PageFilter filters={usersFilters} variant="chips" />

      <DataRenderer
        success={success}
        error={error}
        data={users}
        empty={EMPTY_USERS}
        render={(data) => (
          <div className="flex flex-col gap-10">
            <section className="grid grid-cols-[repeat(auto-fill,minmax(max(240px,calc((100%_-_3_*_1.5rem)_/_4)),1fr))] gap-6">
              {data.map((user) => (
                <UserCard key={user._id} {...user} />
              ))}
            </section>
            <Pagination page={page} isNext={isNext || false} />
          </div>
        )}
      />
    </>
  );
};

export default Community;
