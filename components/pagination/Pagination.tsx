"use client";

import { Button } from "@/components/ui/button";
import { formUrlQuery } from "@/lib/url";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  page: number | undefined | string;
  isNext: boolean;
}

const Pagination = ({ page = 1, isNext }: PaginationProps) => {
  const currentPage = Number(page) || 1;
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePagination = (type: "prev" | "next") => {
    const nextPageNumber = type === "prev" ? currentPage - 1 : currentPage + 1;
    const newUrl = formUrlQuery({ params: searchParams.toString(), key: "page", value: nextPageNumber.toString() });
    router.push(newUrl);
  };

  return (
    <nav className="flex items-center justify-center gap-3" aria-label="Pagination">
      <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => handlePagination("prev")}>
        Prev
      </Button>

      <span className="bg-accent-soft text-accent-solid inline-flex h-[38px] min-w-[38px] items-center justify-center rounded-md px-3 text-sm font-semibold">
        {currentPage}
      </span>

      <Button variant="outline" size="sm" disabled={!isNext} onClick={() => handlePagination("next")}>
        Next
      </Button>
    </nav>
  );
};

export default Pagination;
