"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  FileText,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/common/EmptyState";
import { postService } from "@/services/client/post-service";
import { formatDate, formatNumber } from "@/lib/utils";
import { STATUS_COLORS } from "@/constants";
import { toast } from "sonner";
import { authClient } from "@/lib/client";
import Link from "next/link";

export default function UserPostsPage() {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const userId = session?.user?.id;

  // Pulls up to 100 of the signed-in user's own posts (across every status —
  // the API allows a caller to see their own drafts/scheduled/archived
  // posts, not just published ones) and filters/counts client-side. Fine
  // for a personal blog's post volume; would need real pagination past that.
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-posts", userId],
    queryFn: () =>
      postService.getPosts({ author: userId, status: "all", limit: 100 }),
    enabled: !!userId,
  });

  const userPosts = data?.data ?? [];

  const filtered = userPosts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: userPosts.length,
    published: userPosts.filter((p) => p.status === "published").length,
    draft: userPosts.filter((p) => p.status === "draft").length,
    scheduled: userPosts.filter((p) => p.status === "scheduled").length,
  };

  const handleDelete = async (postId: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    const result = await postService.deletePost(postId);
    if (result.success) {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["dashboard-posts", userId] });
    } else {
      toast.error(result.message ?? "Failed to delete post");
    }
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Posts</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${userPosts.length} articles total`}
          </p>
        </div>
        <Button asChild className=" cursor-pointer">
          <Link href="/dashboard/posts/new">
            <Plus className="w-4 h-4 mr-2" />
            Write Post
          </Link>
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "All", value: counts.all, status: "all" },
          { label: "Published", value: counts.published, status: "published" },
          { label: "Drafts", value: counts.draft, status: "draft" },
          { label: "Scheduled", value: counts.scheduled, status: "scheduled" },
        ].map(({ label, value, status }) => (
          <button
            key={label}
            onClick={() => setStatusFilter(status)}
            className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
              statusFilter === status
                ? "border-primary bg-primary/5"
                : "bg-card hover:bg-muted/30"
            }`}
          >
            <p className="text-lg font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </button>
        ))}
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search posts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-36">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!isLoading && filtered.length === 0 ? (
          <EmptyState
            title={
              userPosts.length === 0
                ? "No posts yet"
                : "No posts match your filter"
            }
            description={
              userPosts.length === 0
                ? "Start writing your first article."
                : "Try a different filter."
            }
            icon={<FileText className="w-8 h-8 text-muted-foreground/40" />}
            action={
              userPosts.length === 0
                ? { label: "Write your first post", onClick: () => {} }
                : undefined
            }
          />
        ) : (
          <div className="divide-y divide-border/60">
            {filtered.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group"
              >
                {/* Thumbnail */}
                <div className="w-14 h-11 rounded-lg overflow-hidden bg-muted shrink-0">
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={`text-[10px] capitalize px-1.5 border ${STATUS_COLORS[post.status]}`}
                    >
                      {post.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {post.category.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(post.createdAt, "MMM d, yyyy")}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(post.viewCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    ❤️ {post.likeCount}
                  </span>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/blog/${post.slug}`}>
                        <Eye className="w-4 h-4" /> View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/posts/${post.id}/edit`}>
                        <Edit className="w-4 h-4" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-danger focus:text-danger"
                      onClick={() => handleDelete(post.id, post.title)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
