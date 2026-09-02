import { uiIcons } from "@/components/icons/huge/data/ui";
import { HugeIconSvg } from "@/components/icons/huge/HugeIconSvg";
import { tagIcon } from "@/lib/devicon";
import { cn } from "@/lib/utils";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const TagList = ({
  tags,
  inline = false,
  onRemove,
  className,
  size = "md",
}: {
  tags: Tag[];
  inline?: boolean;
  /** Pass to render the removable chip — COMPONENTS.md §Tag, `removable`. */
  onRemove?: (name: string) => void;
  className?: string;
  /** COMPONENTS.md §Tag — `sm` is the uppercase card tag row, `md` the list chip. */
  size?: "sm" | "md";
}) => {
  return (
    <ul className={cn("flex list-none pl-0", inline ? "flex-row flex-wrap gap-2" : "flex-col gap-3.5", className)}>
      {tags.map(({ _id, name, questions }) => {
        const icon = tagIcon(name);

        const chip = (
          <span
            className={cn(
              "bg-muted inline-flex items-center gap-2",
              size === "sm"
                ? "text-fg-subtle h-[29px] rounded-md px-4 text-[10px] font-semibold tracking-[0.04em] uppercase"
                : cn("text-fg-muted rounded-sm py-1 text-xs font-medium", onRemove ? "pr-1.5 pl-[10px]" : "px-[10px]")
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
        );

        return (
          <li key={_id} className="flex items-center gap-3">
            {/* Chipy usuwalne zostaja bez linku: maja w srodku <button>, a ich _id to nazwa tagu
                wpisana w formularzu, nie identyfikator z bazy. */}
            {onRemove ? chip : <Link href={ROUTES.TAG(_id)}>{chip}</Link>}
            {questions !== undefined && (
              <span className="text-fg-subtle ml-auto text-sm tabular-nums">{questions}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default TagList;
