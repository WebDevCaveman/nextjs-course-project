import { uiIcons } from "@/components/icons/huge/data/ui";
import { HugeIconSvg } from "@/components/icons/huge/HugeIconSvg";
import { tagIcon } from "@/lib/devicon";
import { cn } from "@/lib/utils";

const TagList = ({
  tags,
  inline = false,
  onRemove,
}: {
  tags: Tag[];
  inline?: boolean;
  /** Pass to render the removable chip — COMPONENTS.md §Tag, `removable`. */
  onRemove?: (name: string) => void;
}) => {
  return (
    <ul className={cn("flex list-none pl-0", inline ? "flex-row flex-wrap gap-2" : "flex-col gap-3.5")}>
      {tags.map(({ _id, name, count }) => {
        const icon = tagIcon(name);

        return (
          <li key={_id} className="flex items-center gap-3">
            <span
              className={cn(
                "bg-muted text-fg-muted inline-flex items-center gap-2 rounded-sm py-1 text-xs font-medium",
                onRemove ? "pr-1.5 pl-[10px]" : "px-[10px]"
              )}
            >
              {icon ? <i className={`${icon} text-[20px]`} /> : <HugeIconSvg icon={uiIcons.tag} size={20} />}
              {name.toUpperCase()}
              {onRemove && (
                <button type="button" aria-label={`Remove ${name}`} onClick={() => onRemove(name)}>
                  <HugeIconSvg icon={uiIcons.close} size={11} />
                </button>
              )}
            </span>
            {count !== undefined && <span className="text-fg-subtle ml-auto text-sm tabular-nums">{count}</span>}
          </li>
        );
      })}
    </ul>
  );
};

export default TagList;
