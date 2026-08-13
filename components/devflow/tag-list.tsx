import { cn } from "@/lib/utils";

export type TagItem = {
  id: string;
  name: string;
  /** devicon class, e.g. "devicon-react-original" — rendered inside the chip. */
  icon?: string;
  /** Omit to drop the count entirely. */
  count?: string | number;
};

// The tag list in both shapes the design uses: stacked (right panel, profile Top Tags)
// and inline (tag rows on cards). Chip and count come from COMPONENTS.md §Tag.
const TagList = ({ tags, inline = false }: { tags: TagItem[]; inline?: boolean }) => {
  return (
    <ul className={cn("flex list-none pl-0", inline ? "flex-row flex-wrap gap-2" : "flex-col gap-3.5")}>
      {tags.map(({ id, name, icon, count }) => (
        <li key={id} className="flex items-center gap-3">
          <span className="bg-muted text-fg-muted inline-flex items-center gap-2 rounded-sm px-[10px] py-1 text-sm font-medium">
            {icon && <i className={`${icon} colored text-[20px]`} />}
            {name}
          </span>
          {count !== undefined && <span className="text-fg-subtle ml-auto text-sm tabular-nums">{count}</span>}
        </li>
      ))}
    </ul>
  );
};

export default TagList;
