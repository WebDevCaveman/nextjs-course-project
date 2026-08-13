import Link from "next/link";

import TagList from "@/components/devflow/tag-list";

// Placeholder content — replaced with real data later.
const hotQuestions = [
  { id: "1", title: "Would it be appropriate to point out an error in another paper?" },
  { id: "2", title: "How can an AirBnB host cancel a reservation without penalty?" },
  { id: "3", title: "Interrogated every time crossing UK Border as citizen" },
  { id: "4", title: "Low digit addition generator" },
  { id: "5", title: "What is an example of 3 numbers that do not make up a vector?" },
];

const popularTags = [
  { id: "react", name: "react", icon: "devicon-react-original", count: "18,209" },
  { id: "javascript", name: "javascript", icon: "devicon-javascript-plain", count: "15,730" },
  { id: "typescript", name: "typescript", icon: "devicon-typescript-plain", count: "12,486" },
  { id: "nodejs", name: "nodejs", icon: "devicon-nodejs-plain", count: "9,041" },
  { id: "python", name: "python", icon: "devicon-python-plain", count: "7,552" },
  { id: "tailwindcss", name: "tailwindcss", icon: "devicon-tailwindcss-original", count: "5,318" },
  { id: "docker", name: "docker", icon: "devicon-docker-plain", count: "4,127" },
  { id: "postgresql", name: "postgresql", icon: "devicon-postgresql-plain", count: "3,864" },
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
