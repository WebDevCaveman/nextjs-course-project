"use client";

import { uiIcons } from "@/components/devflow/icons/huge/data/ui";
import { HugeIconSvg } from "@/components/devflow/icons/huge/HugeIconSvg";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface LocalSearchProps {
  route: string;
  iconName: keyof typeof uiIcons;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearch = ({ route, iconName, placeholder, otherClasses }: LocalSearchProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery === query) return;

      if (searchQuery) {
        const newUrl = formUrlQuery({ params: searchParams.toString(), key: "query", value: searchQuery });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromUrlQuery({ params: searchParams.toString(), keysToRemove: ["query"] });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, query, router, route, searchParams, pathname]);

  return (
    <div
      className={`border-line bg-background focus-within:border-accent-solid flex h-14 items-center gap-3 rounded-xl border px-[18px] ${otherClasses}`}
    >
      <HugeIconSvg icon={uiIcons[iconName]} size={20} className="text-fg-subtle" />
      <Input
        type="search"
        variant="unstyled"
        className="flex-1"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default LocalSearch;
