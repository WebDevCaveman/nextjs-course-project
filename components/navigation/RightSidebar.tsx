import Link from "next/link";

import TagList from "@/components/tag-list/TagList";

// Placeholder content — replaced with real data later.
const hotQuestions = [
  { id: "1", title: "Would it be appropriate to point out an error in another paper?" },
  { id: "2", title: "How can an AirBnB host cancel a reservation without penalty?" },
  { id: "3", title: "Interrogated every time crossing UK Border as citizen" },
  { id: "4", title: "Low digit addition generator" },
  { id: "5", title: "What is an example of 3 numbers that do not make up a vector?" },
];

const popularTags: Tag[] = [
  { _id: "react", name: "react", count: "18,209" },
  { _id: "javascript", name: "javascript", count: "15,730" },
  { _id: "typescript", name: "typescript", count: "12,486" },
  { _id: "nodejs", name: "nodejs", count: "9,041" },
  { _id: "python", name: "python", count: "7,552" },
  { _id: "tailwindcss", name: "tailwindcss", count: "5,318" },
  { _id: "docker", name: "docker", count: "4,127" },
  { _id: "postgresql", name: "postgresql", count: "3,864" },
];

const RightSidebar = () => {
  return (
    <div className="border-line bg-background sticky top-16 hidden h-[calc(100vh-4rem)] w-[350px] shrink-0 flex-col gap-9 overflow-y-auto border-l p-6 xl:flex">
      <section className="flex flex-col gap-4">
        <h3>Hot Network</h3>

        <ul className="flex list-none flex-col gap-3.5 pl-0">
          {hotQuestions.map(({ id, title }, index) => (
            <li key={id} className="flex items-center gap-3.5">
              <span
                className={
                  index % 2 === 0
                    ? "border-accent-solid text-accent-solid inline-flex size-[22px] shrink-0 items-center justify-center rounded-[4px] border text-xs font-semibold"
                    : "border-info text-info inline-flex size-[22px] shrink-0 items-center justify-center rounded-[4px] border text-xs font-semibold"
                }
              >
                ?
              </span>
              <Link href="#" className="text-fg hover:text-accent-solid text-base font-medium">
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h3>Popular Tags</h3>

        <TagList tags={popularTags} />
      </section>
    </div>
  );
};

export default RightSidebar;
