"use client";

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BlogCard, BlogCardSkeleton } from "@/components/cards";
import { SearchEmptyState } from "@/components/common/EmptyState";
import { postService } from "@/services/client/post-service";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q = searchParams.get("q") ?? "";
  const [input, setInput] = useState(q);

  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () => postService.getPosts({ search: q, limit: 20 }),
    enabled: !!q,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", input.trim());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="page-enter">
      <div className="bg-card border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-2xl font-bold mb-4">Search</h1>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search articles, topics, authors…"
                className="h-12 pl-12 pr-12 text-base rounded-xl"
              />
              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {q && (
          <p className="text-sm text-muted-foreground mb-6">
            {isLoading
              ? "Searching…"
              : `${data?.meta.total ?? 0} results for "${q}"`}
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : q && data?.data.length === 0 ? (
          <SearchEmptyState query={q} />
        ) : q && data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((post, idx) => (
              <BlogCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Start typing to search articles</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="page-enter">
          <div className="bg-card border-b">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
              <h1 className="text-2xl font-bold mb-4">Search</h1>
              <div className="relative animate-pulse">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  disabled
                  placeholder="Search articles, topics, authors…"
                  className="h-12 pl-12 pr-12 text-base rounded-xl bg-muted/50"
                />
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
