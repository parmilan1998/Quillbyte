"use client";

import { useQuery } from "@tanstack/react-query";
import { FolderOpen } from "lucide-react";
import { BlogCard, BlogCardSkeleton } from "@/components/cards";
import { EmptyState } from "@/components/common/EmptyState";
import { CategoryService } from "@/services/client/category-service";
import { useParams } from "next/navigation";
import { postService } from "@/services/client/post-service";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAll(),
  });
  const category = allCategories.find((c) => c.slug === slug);

  const { data, isLoading } = useQuery({
    queryKey: ["posts", "category", slug],
    queryFn: () => postService.getPosts({ category: slug, limit: 12 }),
    enabled: !!slug,
  });

  return (
    <div className="page-enter">
      <div
        className="bg-card border-b"
        style={{
          borderTop: `4px solid ${category?.color ?? "var(--primary)"}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${category?.color ?? "var(--primary)"}20`,
              }}
            >
              <FolderOpen
                className="w-5 h-5"
                style={{ color: category?.color ?? "var(--primary)" }}
              />
            </div>
            <h1 className="text-3xl font-bold">{category?.name ?? slug}</h1>
          </div>
          {category?.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {data?.meta.total ?? category?.postCount ?? 0} articles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : !data?.data.length ? (
          <EmptyState title="No articles in this category" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((post, idx) => (
              <BlogCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
