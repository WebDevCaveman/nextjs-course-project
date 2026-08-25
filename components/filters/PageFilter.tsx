"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";

interface PageFilterProps {
  filters: { name: string; value: string }[];
}

const PageFilter = ({ filters }: PageFilterProps) => {
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

  return (
    <div className="flex flex-wrap gap-3">
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
  );
};

export default PageFilter;
