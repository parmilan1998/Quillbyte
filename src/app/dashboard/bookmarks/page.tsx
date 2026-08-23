"use client";

import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Clock, Eye, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { postService } from "@/services/client/post-service";
import { formatDate, formatNumber } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export default function UserBookmarksPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-bookmarks"],
    queryFn: () => postService.getMyBookmarks({ limit: 50 }),
  });
  const bookmarks = data?.data ?? [];

  const handleRemove = async (postId: string) => {
    const result = await postService.unbookmarkPost(postId);
    if (result.bookmarked === false) {
      queryClient.invalidateQueries({ queryKey: ["my-bookmarks"] });
      toast.success("Bookmark removed");
    }
  };

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading…" : `${bookmarks.length} saved articles`}
        </p>
      </div>

      {!isLoading && bookmarks.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          description="Save articles you want to read later."
          icon={<Bookmark className="w-8 h-8 text-muted-foreground/40" />}
        />
      ) : (
        <div className="space-y-4">
          {bookmarks.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="bg-card border rounded-2xl p-4 hover:border-primary/20 transition-all card-hover"
            >
              <div className="flex gap-4">
                {post.featuredImage && (
                  <Link href={`/blog/${post.slug}`} className="shrink-0">
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-muted">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge
                      variant="secondary"
                      className="text-[10px]"
                      style={{
                        backgroundColor: `${post.category.color}20`,
                        color: post.category.color,
                      }}
                    >
                      {post.category.name}
                    </Badge>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}m read
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatNumber(post.viewCount)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likeCount}
                    </span>
                    <span>
                      {formatDate(
                        post.publishedAt ?? post.createdAt,
                        "MMM d, yyyy",
                      )}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(post.id)}
                  className="shrink-0 cursor-pointer text-primary hover:text-primary/70 transition-colors"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
