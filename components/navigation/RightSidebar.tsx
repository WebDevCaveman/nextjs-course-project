import Link from "next/link";
import TagList from "@/components/tag-list/TagList";
import { getHotQuestions } from "@/lib/actions/question.action";
import { DataRenderer } from "../DataRenderer";
import ROUTES from "@/constants/routes";
import { getTopTags } from "@/lib/actions/tag.action";

const RightSidebar = async () => {
  const [{ success, data: hotQuestions, error }, { success: tagsSuccess, data: topTags, error: tagsError }] =
    await Promise.all([getHotQuestions(), getTopTags()]);

  return (
    <div className="border-line bg-background sticky top-16 hidden h-[calc(100vh-4rem)] w-[350px] shrink-0 flex-col gap-9 overflow-y-auto border-l p-6 xl:flex">
      <DataRenderer
        success={success}
        error={error}
        data={hotQuestions}
        empty={{ title: "No hot questions found", message: "No questions have been asked yet." }}
        render={(hotQuestions) => (
          <section className="flex flex-col gap-4">
            <h3>Hot Network</h3>

            <ul className="flex list-none flex-col gap-3.5 pl-0">
              {hotQuestions.map(({ _id, title }, index) => (
                <li key={_id} className="flex items-center gap-3.5">
                  <span
                    className={
                      index % 2 === 0
                        ? "border-accent-solid text-accent-solid inline-flex size-[22px] shrink-0 items-center justify-center rounded-[4px] border text-xs font-semibold"
                        : "border-info text-info inline-flex size-[22px] shrink-0 items-center justify-center rounded-[4px] border text-xs font-semibold"
                    }
                  >
                    ?
                  </span>
                  <Link href={ROUTES.QUESTION(_id)} className="text-fg hover:text-accent-solid text-base font-medium">
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      />

      <DataRenderer
        success={tagsSuccess}
        error={tagsError}
        data={topTags}
        empty={{ title: "No tags found", message: "No tags have been created yet." }}
        render={(topTags) => (
          <section className="flex flex-col gap-4">
            <h3>Top Tags</h3>
            <TagList tags={topTags} />
          </section>
        )}
      />
    </div>
  );
};

export default RightSidebar;
