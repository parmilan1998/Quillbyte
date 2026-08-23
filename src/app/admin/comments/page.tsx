"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Trash2, Search, Filter, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { formatRelativeDate, getInitials } from "@/lib/utils";
import { STATUS_COLORS } from "@/constants";
import { toast } from "sonner";
import { commentService } from "@/services/client/comment-service";

export default function AdminCommentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "comments", status, search],
    queryFn: () => commentService.getComments({ status, search }),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => commentService.approveComment(id),
    onSuccess: () => {
      toast.success("Comment approved");
      queryClient.invalidateQueries({ queryKey: ["admin", "comments"] });
    },
  });
  const rejectMutation = useMutation({
    mutationFn: (id: string) => commentService.rejectComment(id),
    onSuccess: () => {
      toast.success("Comment rejected");
      queryClient.invalidateQueries({ queryKey: ["admin", "comments"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => commentService.deleteComment(id),
    onSuccess: () => {
      toast.success("Comment deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "comments"] });
    },
  });

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 className="text-2xl font-bold">Comments</h1>
        <p className="text-sm text-muted-foreground">
          {data?.meta.total ?? 0} total comments
        </p>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search comments…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-36">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : !data?.data.length ? (
          <EmptyState
            title="No comments found"
            icon={
              <MessageSquare className="w-8 h-8 text-muted-foreground/40" />
            }
          />
        ) : (
          <div className="divide-y divide-border/60">
            {data.data.map((comment) => (
              <div
                key={comment.id}
                className="p-4 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar size="sm">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>
                      {getInitials(comment.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold">
                        {comment.author.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeDate(comment.createdAt)}
                      </span>
                      <Badge
                        className={`text-[10px] capitalize border ${STATUS_COLORS[comment.status]}`}
                      >
                        {comment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {comment.content}
                    </p>
                    {comment.postTitle && (
                      <p className="text-xs text-muted-foreground/70">
                        On:{" "}
                        <span className="text-primary">
                          {comment.postTitle}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {comment.status !== "approved" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-success hover:bg-success/10 cursor-pointer"
                        title="Approve"
                        onClick={() => approveMutation.mutate(comment.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    {comment.status !== "rejected" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-warning hover:bg-warning/10 cursor-pointer"
                        title="Reject"
                        onClick={() => rejectMutation.mutate(comment.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-danger hover:bg-danger/10 cursor-pointer"
                      title="Delete"
                      onClick={() => deleteMutation.mutate(comment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
