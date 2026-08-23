"use client";

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { BlogCard, BlogCardSkeleton } from "@/components/cards";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { CategoryService } from "@/services/client/category-service";
import { TagService } from "@/services/client/tag-service";
import { cn } from "@/lib/utils";
import { postService } from "@/services/client/post-service";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function BlogListPageContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAll(),
  });
  const { data: allTags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => TagService.getAll(),
  });

  const page = Number(searchParams.get("page") ?? 1);
  const category = searchParams.get("category") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    updateSearchParams(next);
  };

  const updateSearchParams = (params: URLSearchParams) => {
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasFilters = category || tag || search || sort !== "newest";

  const { data, isLoading } = useQuery({
    queryKey: ["posts", "list", { page, category, tag, search, sort }],
    queryFn: () =>
      postService.getPosts({ page, category, tag, search, sort, limit: 9 }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParam("search", searchInput);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => setParam("category", "")}
            className={cn(
              "w-full flex items-center cursor-pointer justify-between text-sm px-3 py-2 rounded-lg transition-colors text-left",
              !category
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent",
            )}
          >
            All Categories
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setParam("category", cat.slug)}
              className={cn(
                "w-full flex items-center cursor-pointer justify-between text-sm px-3 py-2 rounded-lg transition-colors text-left",
                category === cat.slug
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent",
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {cat.postCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Tags */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.slice(0, 12).map((t) => (
            <button
              key={t.id}
              onClick={() => setParam("tag", tag === t.slug ? "" : t.slug)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                tag === t.slug
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:border-primary/30 hover:text-primary text-muted-foreground",
              )}
            >
              #{t.name}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <>
          <Separator />
          <Button
            variant="outline"
            size="sm"
            className="w-full cursor-pointer"
            onClick={clearFilters}
          >
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold mb-2">All Articles</h1>
          <p className="text-muted-foreground">
            {data
              ? `${data.meta.total} articles published`
              : "Discover stories that matter"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card border rounded-2xl p-5">
              <h2 className="font-semibold text-sm mb-4">Filters</h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search articles…"
                    className="pl-9 h-9"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput("");
                        setParam("search", "");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  size="sm"
                  variant="secondary"
                  className=" cursor-pointer"
                >
                  Search
                </Button>
              </form>

              <div className="flex items-center gap-2">
                <Select value={sort} onValueChange={(v) => setParam("sort", v)}>
                  <SelectTrigger className="h-9 w-[140px] text-sm">
                    <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                    <SelectItem value="likes">Most Liked</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile filter */}
                <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden gap-2 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                      {hasFilters && (
                        <Badge
                          variant="default"
                          className="w-4 h-4 p-0 flex items-center justify-center text-[10px] rounded-full"
                        >
                          !
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <FilterPanel />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active filters */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-xs text-muted-foreground">Active:</span>
                {category && (
                  <Badge variant="secondary" className="gap-1.5 text-xs">
                    {allCategories.find((c) => c.slug === category)?.name}
                    <button
                      onClick={() => setParam("category", "")}
                      className=" cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {tag && (
                  <Badge variant="secondary" className="gap-1.5 text-xs">
                    #{tag}
                    <button
                      onClick={() => setParam("tag", "")}
                      className=" cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {search && (
                  <Badge variant="secondary" className="gap-1.5 text-xs">
                    "{search}"
                    <button
                      onClick={() => {
                        setSearchInput("");
                        setParam("search", "");
                      }}
                      className=" cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground cursor-pointer hover:text-danger transition-colors ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            ) : !data?.data.length ? (
              <EmptyState
                title="No articles found"
                description={
                  search
                    ? `No results for "${search}"`
                    : "Try adjusting your filters."
                }
                action={{ label: "Clear Filters", onClick: clearFilters }}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.data.map((post, idx) => (
                    <BlogCard key={post.id} post={post} index={idx} />
                  ))}
                </div>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * 9 + 1}–
                    {Math.min(page * 9, data.meta.total)} of {data.meta.total}{" "}
                    articles
                  </p>
                  <Pagination
                    page={page}
                    totalPages={data.meta.totalPages}
                    onPageChange={(p) => {
                      const next = new URLSearchParams(searchParams);
                      next.set("page", String(p));
                      updateSearchParams(next);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogListPage() {
  return (
    <Suspense
      fallback={
        <div className="page-enter">
          <div className="bg-card border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
              <h1 className="text-3xl font-bold mb-2">All Articles</h1>
              <p className="text-muted-foreground">
                Discover stories that matter
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex gap-8">
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24 bg-card border rounded-2xl p-5">
                  <h2 className="font-semibold text-sm mb-4">Filters</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="h-8 bg-muted rounded animate-pulse" />
                      <div className="h-8 bg-muted rounded animate-pulse" />
                      <div className="h-8 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </aside>
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <BlogCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <BlogListPageContent />
    </Suspense>
  );
}
