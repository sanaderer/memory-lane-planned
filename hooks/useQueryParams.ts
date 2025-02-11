"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

type FilterType = "all" | "thisYear" | "lastYear";
type SortType = "newest" | "oldest";

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterType: FilterType = useMemo(() => {
    const value = searchParams.get("filter");
    return value === "thisYear" || value === "lastYear" ? value : "all";
  }, [searchParams]);

  const sortOrder: SortType = useMemo(() => {
    const value = searchParams.get("sort");
    return value === "newest" || value === "oldest" ? value : "newest";
  }, [searchParams]);
  const setParams = useCallback(
    (newParams: Partial<{ filter: FilterType; sort: SortType }>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const updateQueryParams = useCallback(
    (newParams: Partial<{ filter: FilterType; sort: SortType }>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clearFiltersAndSort = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    filterType,
    sortOrder,
    setParams,
    updateQueryParams,
    clearFiltersAndSort,
  };
}
