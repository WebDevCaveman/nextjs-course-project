"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { uiIcons } from "@/components/icons/huge/data/ui";
import { HugeIconSvg } from "@/components/icons/huge/HugeIconSvg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import ROUTES from "@/constants/routes";
import { globalSearch } from "@/lib/actions/general.action";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";

const searchTypes: GlobalSearchType[] = ["question", "answer", "user", "tag"];

const resultRoutes: Record<GlobalSearchType, (id: string) => string> = {
  question: ROUTES.QUESTION,
  answer: ROUTES.QUESTION,
  user: ROUTES.PROFILE,
  tag: ROUTES.TAG,
};

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
};

const SearchField = ({ value, onChange, onFocus }: SearchFieldProps) => (
  <div className="bg-subtle focus-within:border-accent-solid flex h-12 items-center gap-3 rounded-[10px] border border-transparent px-4">
    <HugeIconSvg icon={uiIcons.search} size={20} className="text-fg-subtle shrink-0" />
    <Input
      type="search"
      variant="unstyled"
      className="flex-1"
      placeholder="Search anything globally"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
    />
  </div>
);

type SearchPanelProps = {
  results: GlobalSearchResult[];
  isLoading: boolean;
  type?: GlobalSearchType;
  onTypeChange: (type: GlobalSearchType) => void;
  onSelect: () => void;
};

const SearchPanel = ({ results, isLoading, type, onTypeChange, onSelect }: SearchPanelProps) => (
  <>
    <div className="flex flex-wrap items-center gap-2.5">
      <small>Type:</small>
      {searchTypes.map((searchType) => (
        <button
          key={searchType}
          type="button"
          aria-pressed={type === searchType}
          onClick={() => onTypeChange(searchType)}
          className={`h-[30px] rounded-md px-3.5 text-[13px] capitalize ${
            type === searchType ? "bg-accent-solid font-semibold text-white" : "bg-muted text-fg-muted font-medium"
          }`}
        >
          {searchType}
        </button>
      ))}
    </div>

    <div className="flex flex-col gap-2.5">
      <small>Top Match</small>

      {isLoading ? (
        <div className="flex flex-col gap-1">
          <Skeleton className="h-[41px] rounded-md" />
          <Skeleton className="h-[41px] rounded-md" />
          <Skeleton className="h-[41px] rounded-md" />
        </div>
      ) : results.length > 0 ? (
        <ul className="flex list-none flex-col gap-1 pl-0">
          {results.map((result) => (
            <li key={`${result.type}-${result.id}-${result.title}`}>
              <Link
                href={resultRoutes[result.type](result.id)}
                onClick={onSelect}
                className="hover:bg-muted text-fg flex items-center gap-2.5 rounded-md px-2 py-2.5"
              >
                <HugeIconSvg icon={uiIcons.tag} size={16} className="text-fg-subtle shrink-0" />
                <span className="flex-1 truncate text-base font-medium">{result.title}</span>
                <span className="text-info shrink-0 text-sm capitalize">{result.type}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  </>
);

const GlobalSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("global") || "";
  const type = (searchParams.get("type") as GlobalSearchType | null) ?? undefined;

  const [search, setSearch] = useState(query);
  const [loaded, setLoaded] = useState<{ query: string; type?: GlobalSearchType; results: GlobalSearchResult[] }>({
    query: "",
    results: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search === query) return;

      const newUrl = search
        ? formUrlQuery({ params: searchParams.toString(), key: "global", value: search })
        : removeKeysFromUrlQuery({ params: searchParams.toString(), keysToRemove: ["global", "type"] });

      router.push(newUrl, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, query, router, searchParams]);

  useEffect(() => {
    if (!query) return;

    let isCurrent = true;

    globalSearch({ query, type }).then((result) => {
      if (isCurrent) setLoaded({ query, type, results: result.data || [] });
    });

    return () => {
      isCurrent = false;
    };
  }, [query, type]);

  const isLoading = search !== loaded.query || type !== loaded.type;
  const results = isLoading ? [] : loaded.results;

  const handleTypeChange = (nextType: GlobalSearchType) => {
    const newUrl =
      nextType === type
        ? removeKeysFromUrlQuery({ params: searchParams.toString(), keysToRemove: ["type"] })
        : formUrlQuery({ params: searchParams.toString(), key: "type", value: nextType });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex max-w-[830px] flex-1 justify-end md:justify-start">
      <Popover open={isOpen && search.length > 0} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <div ref={fieldRef} className="hidden w-full md:block">
            <SearchField value={search} onChange={setSearch} onFocus={() => setIsOpen(true)} />
          </div>
        </PopoverAnchor>

        <PopoverContent
          variant="panel"
          align="start"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            if (fieldRef.current?.contains(event.target as Node)) event.preventDefault();
          }}
        >
          <SearchPanel
            results={results}
            isLoading={isLoading}
            type={type}
            onTypeChange={handleTypeChange}
            onSelect={() => setIsOpen(false)}
          />
        </PopoverContent>
      </Popover>

      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="icon" size="icon" aria-label="Search">
            <HugeIconSvg icon={uiIcons.search} size={20} />
          </Button>
        </SheetTrigger>

        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle className="sr-only">Search</SheetTitle>
            <SheetDescription className="sr-only">Search questions, answers, users and tags</SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-5 px-4 pb-6">
            <SearchField value={search} onChange={setSearch} />

            {search.length > 0 && (
              <SearchPanel
                results={results}
                isLoading={isLoading}
                type={type}
                onTypeChange={handleTypeChange}
                onSelect={() => setIsOpen(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default GlobalSearch;
