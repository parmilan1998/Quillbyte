"use client";

import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Eye, Trash2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { postService } from "@/services/client/post-service";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export default function UserHistoryPage() {
  const queryClient = useQueryClient();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ["reading-history"],
    queryFn: () => postService.getMyReadingHistory(),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["reading-history"] });

  const handleClearAll = async () => {
    await postService.clearHistory();
    invalidate();
    toast.success("History cleared");
  };

  const handleRemove = async (postId: string) => {
    await postService.removeFromHistory(postId);
    invalidate();
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reading History</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${history.length} articles read`}
          </p>
        </div>
        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className=" cursor-pointer"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear History
          </Button>
        )}
      </div>

      {!isLoading && history.length === 0 ? (
        <EmptyState
          title="No reading history"
          description="Articles you read will appear here."
          icon={<Clock className="w-8 h-8 text-muted-foreground/40" />}
          action={{
            label: "Browse Articles",
            onClick: () => (window.location.href = "/blog"),
          }}
        />
      ) : (
        <div className="space-y-3">
          {history.map(({ post, progress, lastViewedAt }, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-card border rounded-2xl p-4 hover:border-primary/20 transition-all group"
            >
              <div className="flex gap-4 items-start">
                {/* Thumbnail */}
                {post.featuredImage && (
                  <Link href={`/blog/${post.slug}`} className="shrink-0">
                    <div className="w-16 h-14 rounded-xl overflow-hidden bg-muted img-zoom">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Badge
                        variant="secondary"
                        className="text-[10px] mb-1.5"
                        style={{
                          backgroundColor: `${post.category.color}15`,
                          color: post.category.color,
                        }}
                      >
                        {post.category.name}
                      </Badge>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="block font-semibold text-sm hover:text-primary transition-colors line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(lastViewedAt, "MMM d")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.readingTime} min read
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleRemove(post.id)}
                        className="text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                      <span>Reading progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/60 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
