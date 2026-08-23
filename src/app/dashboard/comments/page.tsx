"use client";

import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Heart, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { commentService } from "@/services/client/comment-service";
import { formatRelativeDate } from "@/lib/utils";
import { STATUS_COLORS } from "@/constants";
import { toast } from "sonner";
import Link from "next/link";

export default function UserCommentsPage() {
  const queryClient = useQueryClient();

  const { data: userComments = [], isLoading } = useQuery({
    queryKey: ["my-comments"],
    queryFn: () => commentService.getMyComments(),
  });

  const handleDelete = async (id: string) => {
    const result = await commentService.deleteComment(id);
    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ["my-comments"] });
      toast.success("Comment deleted");
    } else {
      toast.error(result.message ?? "Failed to delete comment");
    }
  };

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 className="text-2xl font-bold">My Comments</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading…" : `${userComments.length} comments total`}
        </p>
      </div>

      {!isLoading && userComments.length === 0 ? (
        <EmptyState
          title="No comments yet"
          description="Start a conversation by commenting on an article."
          icon={<MessageSquare className="w-8 h-8 text-muted-foreground/40" />}
          action={{
            label: "Browse Articles",
            onClick: () => (window.location.href = "/blog"),
          }}
        />
      ) : (
        <div className="space-y-3">
          {userComments.map((comment, idx) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="bg-card border rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {comment.postTitle && (
                    <Link
                      href={`/blog/${comment.postSlug ?? comment.postId}`}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {comment.postTitle}
                    </Link>
                  )}
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <Badge
                      className={`text-[10px] capitalize border ${STATUS_COLORS[comment.status]}`}
                    >
                      {comment.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeDate(comment.createdAt)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Heart className="w-3 h-3" /> {comment.likeCount} likes
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-danger shrink-0 cursor-pointer"
                  onClick={() => handleDelete(comment.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
