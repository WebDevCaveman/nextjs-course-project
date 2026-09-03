"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HugeIconSvg } from "@/components/icons/huge/HugeIconSvg";
import { uiIcons } from "@/components/icons/huge/data/ui";

interface PageFilterProps {
  filters: { name: string; value: string }[];
  // "chips" to rzad przyciskow (Home, Tags), "select" to sortujacy dropdown (lista odpowiedzi)
  variant?: "chips" | "select";
}

const PageFilter = ({ filters, variant = "chips" }: PageFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParams = searchParams.get("filter");
  const [active, setActive] = useState(filterParams || "");

  const handleFilterChange = (filter: string) => {
    let newUrl = "";

    if (active === filter) {
      setActive("");
      newUrl = removeKeysFromUrlQuery({ params: searchParams.toString(), keysToRemove: ["filter"] });
    } else {
      setActive(filter);
      newUrl = formUrlQuery({ params: searchParams.toString(), key: "filter", value: filter });
    }

    router.push(newUrl, { scroll: false });
  };

  const filterSelect = (
    <Select value={active} onValueChange={handleFilterChange}>
      <SelectTrigger
        variant="soft"
        size="filter"
        width="responsive"
        aria-label={variant === "select" ? "Sort by" : "Filter"}
      >
        <HugeIconSvg icon={uiIcons.filter} size={16} className="text-fg-subtle" />
        <SelectValue placeholder={filters[0].name} />
      </SelectTrigger>
      <SelectContent>
        {filters.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  if (variant === "select") return filterSelect;

  return (
    <>
      <div className="md:hidden">{filterSelect}</div>

      <div className="hidden flex-wrap gap-3 md:flex">
        {filters.map((item) => (
          <button
            key={item.value}
            className={cn(
              "bg-muted text-fg-muted h-[42px] rounded-lg px-4 text-[13px] font-medium",
              active === item.value && "bg-accent-soft text-accent-solid font-semibold"
            )}
            onClick={() => {
              handleFilterChange(item.value);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default PageFilter;
