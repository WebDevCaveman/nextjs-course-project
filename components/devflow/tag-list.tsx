import { uiIcons } from "@/components/devflow/icons/huge/data/ui";
import { HugeIconSvg } from "@/components/devflow/icons/huge/HugeIconSvg";
import { tagIcon } from "@/lib/devicon";
import { cn } from "@/lib/utils";

export type TagItem = {
  id: string;
  name: string;
  /** Omit to drop the count entirely. */
  count?: string | number;
};

const TagList = ({ tags, inline = false }: { tags: TagItem[]; inline?: boolean }) => {
  return (
    <ul className={cn("flex list-none pl-0", inline ? "flex-row flex-wrap gap-2" : "flex-col gap-3.5")}>
      {tags.map(({ id, name, count }) => {
        const icon = tagIcon(name);

        return (
          <li key={id} className="flex items-center gap-3">
            <span className="bg-muted text-fg-muted inline-flex items-center gap-2 rounded-sm px-[10px] py-1 text-sm font-medium">
              {icon ? <i className={`${icon} text-[20px]`} /> : <HugeIconSvg icon={uiIcons.tag} size={20} />}
              {name}
            </span>
            {count !== undefined && <span className="text-fg-subtle ml-auto text-sm tabular-nums">{count}</span>}
          </li>
        );
      })}
    </ul>
  );
};

export default TagList;
