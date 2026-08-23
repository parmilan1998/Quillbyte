"use client";

import { useQuery } from "@tanstack/react-query";
import { Hash } from "lucide-react";
import { BlogCard, BlogCardSkeleton } from "@/components/cards";
import { EmptyState } from "@/components/common/EmptyState";
import { TagService } from "@/services/client/tag-service";
import { useParams } from "next/navigation";
import { postService } from "@/services/client/post-service";

export default function TagPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: allTags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => TagService.getAll(),
  });
  const tag = allTags.find((t) => t.slug === slug);

  const { data, isLoading } = useQuery({
    queryKey: ["posts", "tag", slug],
    queryFn: () => postService.getPosts({ tag: slug, limit: 12 }),
    enabled: !!slug,
  });

  return (
    <div className="page-enter">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-1">
            <Hash className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-bold">{slug}</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {data?.meta.total ?? tag?.postCount ?? 0} articles tagged #{slug}
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
          <EmptyState title={`No articles tagged #${slug}`} />
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
