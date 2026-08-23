"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Clock,
  Eye,
  Heart,
  Bookmark,
  Share2,
  AtSign,
  Link2,
  ArrowLeft,
  MessageSquare,
  ChevronRight,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { BlogCard } from "@/components/cards";
import {
  formatDate,
  formatRelativeDate,
  formatNumber,
  getInitials,
} from "@/lib/utils";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { postService } from "@/services/client/post-service";
import { commentService } from "@/services/client/comment-service";
import { ReportDialog } from "@/components/common/ReportDialog";
import { authClient } from "@/lib/client";
import type { Comment } from "@/types";
import Link from "next/link";

const allowedTags = new Set([
  "H1",
  "H2",
  "H3",
  "P",
  "STRONG",
  "EM",
  "UL",
  "OL",
  "LI",
  "BLOCKQUOTE",
  "PRE",
  "CODE",
  "BR",
]);

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

function renderPostHtml(content: string) {
  if (typeof window === "undefined") return "";

  const source = /<\/?(h1|h2|h3|p|ul|ol|li|pre|code|blockquote)\b/i.test(
    content,
  )
    ? content
    : content
        .split("\n")
        .map((line) => {
          const trimmed = line.trim();
          if (!trimmed) return "";
          if (trimmed.startsWith("### "))
            return `<h3>${escapeHtml(trimmed.slice(4))}</h3>`;
          if (trimmed.startsWith("## "))
            return `<h2>${escapeHtml(trimmed.slice(3))}</h2>`;
          if (trimmed.startsWith("# "))
            return `<h1>${escapeHtml(trimmed.slice(2))}</h1>`;
          if (trimmed.startsWith("> "))
            return `<blockquote>${escapeHtml(trimmed.slice(2))}</blockquote>`;
          return `<p>${escapeHtml(trimmed)}</p>`;
        })
        .join("");

  const document = new DOMParser().parseFromString(source, "text/html");
  document.body.querySelectorAll("*").forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }

    Array.from(element.attributes).forEach((attribute) => {
      element.removeAttribute(attribute.name);
    });
  });

  document.body.querySelectorAll("h1, h2, h3").forEach((heading) => {
    const id = (heading.textContent ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (id) heading.id = id;
  });

  return document.body.innerHTML;
}

function getContentHeadings(content: string) {
  if (/<\/?(h1|h2|h3)\b/i.test(content)) {
    if (typeof window === "undefined") return [];
    const document = new DOMParser().parseFromString(content, "text/html");
    return Array.from(document.body.querySelectorAll("h1, h2, h3")).map(
      (heading) => heading.textContent?.trim() ?? "",
    );
  }

  return content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.slice(3).trim());
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [renderedContent, setRenderedContent] = useState("");

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => postService.getPost(slug!),
    enabled: !!slug,
  });

  const { data: related } = useQuery({
    queryKey: ["posts", "related", post?.id, post?.category.id],
    queryFn: () => postService.getRelatedPosts(post!.id, post!.category.id),
    enabled: !!post,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", post?.id],
    queryFn: () => commentService.getPostComments(post!.id),
    enabled: !!post,
  });

  useEffect(() => {
    if (post?.content) setRenderedContent(renderPostHtml(post.content));
  }, [post?.content]);

  const invalidatePost = () =>
    queryClient.invalidateQueries({ queryKey: ["post", slug] });
  const invalidateComments = () =>
    queryClient.invalidateQueries({ queryKey: ["comments", post?.id] });

  // Records exactly one view per post load — guarded against React's dev
  // double-invoke and refiring on unrelated re-renders (see the note in
  // the /view route about this being a simple, not bot/refresh-proof,
  // counter).
  const viewedPostId = useRef<string | null>(null);
  useEffect(() => {
    if (!post || viewedPostId.current === post.id) return;
    viewedPostId.current = post.id;
    postService.recordView(post.id).catch(() => {
      // A missed view count isn't worth surfacing to the reader.
    });
  }, [post]);

  const likeMutation = useMutation({
    mutationFn: () =>
      post!.isLiked
        ? postService.unlikePost(post!.id)
        : postService.likePost(post!.id),
    onSuccess: invalidatePost,
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const bookmarkMutation = useMutation({
    mutationFn: () =>
      post!.isBookmarked
        ? postService.unbookmarkPost(post!.id)
        : postService.bookmarkPost(post!.id),
    onSuccess: () => {
      invalidatePost();
      toast.success(
        post!.isBookmarked ? "Bookmark removed" : "Bookmark saved!",
      );
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const requireAuth = (action: () => void) => {
    if (!session) {
      toast.info("Sign in to do that.");
      router.push("/auth/sign-in");
      return;
    }
    action();
  };

  const commentMutation = useMutation({
    mutationFn: (vars: { content: string; parentId?: string }) =>
      commentService.createComment(post!.id, vars.content, vars.parentId),
    onSuccess: (result, vars) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      invalidateComments();
      invalidatePost();
      if (vars.parentId) {
        setReplyText("");
        setReplyingTo(null);
      } else {
        setCommentText("");
      }
      toast.success("Comment posted!");
    },
  });

  const commentLikeMutation = useMutation({
    mutationFn: (vars: { id: string; liked: boolean }) =>
      vars.liked
        ? commentService.unlikeComment(vars.id)
        : commentService.likeComment(vars.id),
    onSuccess: invalidateComments,
  });

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post?.title ?? "";
    if (platform === "twitter")
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
      );
    if (platform === "linkedin")
      window.open(`https://linkedin.com/sharing/share-offsite/?url=${url}`);
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-2">Article not found</h1>
        <p className="text-muted-foreground mb-6">
          This post may have been moved or deleted.
        </p>
        <Button
          onClick={() => router.push("/blog")}
          className=" cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back href Blog
        </Button>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 py-10">
          {/* Main content */}
          <article className="min-w-0">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href="/blog"
                className="hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href={`/categories/${post.category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {post.category.name}
              </Link>
            </nav>

            {/* Category + status */}
            <div className="flex items-center gap-2 mb-4">
              <Link href={`/categories/${post.category.slug}`}>
                <Badge
                  className="text-xs font-semibold"
                  style={{
                    backgroundColor: `${post.category.color}20`,
                    color: post.category.color,
                    borderColor: `${post.category.color}30`,
                  }}
                >
                  {post.category.name}
                </Badge>
              </Link>
              {post.isFeatured && (
                <Badge className="bg-warning/15 text-warning-foreground border-warning/20 text-xs">
                  ⭐ Featured
                </Badge>
              )}
              {post.isTrending && (
                <Badge className="bg-danger/15 text-danger border-danger/20 text-xs">
                  🔥 Trending
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b">
              <div className="flex items-center gap-3">
                <Link href={`/authors/${post.author.id}`}>
                  <Avatar>
                    <AvatarImage
                      src={post.author.avatar}
                      alt={post.author.name}
                    />
                    <AvatarFallback>
                      {getInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    href={`/authors/${post.author.id}`}
                    className="text-sm font-semibold hover:text-primary transition-colors"
                  >
                    {post.author.name}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </span>
                    <span>·</span>
                    <Clock className="w-3 h-3" />
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {formatNumber(post.viewCount)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  {formatNumber(post.likeCount)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  {post.commentCount}
                </span>
              </div>
            </div>

            {/* Featured image */}
            {post.featuredImage && (
              <div className="rounded-2xl overflow-hidden mb-8">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="blog-prose max-w-none min-w-0 overflow-hidden"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            ></div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
              {post.tags.map((tag) => (
                <Link key={tag.id} href={`/tags/${tag.slug}`}>
                  <Badge
                    variant="outline"
                    className="text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Share */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t">
              <span className="text-sm font-medium text-muted-foreground">
                Share:
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("twitter")}
                className=" cursor-pointer"
              >
                <AtSign className="w-4 h-4 mr-1.5" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("linkedin")}
                className=" cursor-pointer"
              >
                <Link2 className="w-4 h-4 mr-1.5" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare("copy")}
                className=" cursor-pointer"
              >
                <Link2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Author bio */}
            <div className="mt-10 p-6 bg-card border rounded-2xl">
              <div className="flex items-start gap-4">
                <Link href={`/authors/${post.author.id}`}>
                  <Avatar size="lg">
                    <AvatarImage
                      src={post.author.avatar}
                      alt={post.author.name}
                    />
                    <AvatarFallback>
                      {getInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <Link
                    href={`/authors/${post.author.id}`}
                    className="font-bold hover:text-primary transition-colors"
                  >
                    {post.author.name}
                  </Link>
                  <p className="text-xs text-primary font-medium mt-0.5 capitalize">
                    {post.author.role}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {post.author.bio}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-muted-foreground">
                      {post.author.postCount} articles
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {formatNumber(post.author.followerCount)} followers
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-6">
                Comments ({post.commentCount})
              </h2>

              {/* New comment form */}
              {session ? (
                <div className="flex gap-3 mb-6">
                  <Avatar size="sm">
                    <AvatarImage src={session.user.image ?? undefined} />
                    <AvatarFallback>
                      {getInitials(session.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts…"
                      className="resize-none h-20"
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        disabled={
                          !commentText.trim() || commentMutation.isPending
                        }
                        onClick={() =>
                          commentMutation.mutate({
                            content: commentText.trim(),
                          })
                        }
                        className=" cursor-pointer"
                      >
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 border border-dashed rounded-xl text-sm text-muted-foreground">
                  <Link
                    href="/auth/sign-in"
                    className="text-primary font-medium"
                  >
                    Sign in
                  </Link>{" "}
                  to join the discussion.
                </div>
              )}

              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No comments yet — be the first to share your thoughts.
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      session={session}
                      replyingTo={replyingTo}
                      replyText={replyText}
                      onReplyTextChange={setReplyText}
                      onReplyClick={(id) =>
                        setReplyingTo(replyingTo === id ? null : id)
                      }
                      onSubmitReply={(parentId) =>
                        requireAuth(() =>
                          commentMutation.mutate({
                            content: replyText.trim(),
                            parentId,
                          }),
                        )
                      }
                      onLikeComment={(id, liked) =>
                        requireAuth(() =>
                          commentLikeMutation.mutate({ id, liked }),
                        )
                      }
                      isReplyPending={commentMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Related */}
            {related && related.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {related.map((p, idx) => (
                    <BlogCard key={p.id} post={p} index={idx} />
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              <div className="bg-card border rounded-2xl p-5">
                <h3 className="text-sm font-bold mb-3">Table of Contents</h3>
                <nav className="space-y-1.5">
                  {getContentHeadings(post.content)
                    .filter(Boolean)
                    .map((heading, idx) => (
                      <a
                        key={idx}
                        href={`#${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                        className="block text-xs text-muted-foreground hover:text-primary transition-colors py-0.5"
                      >
                        {heading}
                      </a>
                    ))}
                </nav>
              </div>

              {/* Actions */}
              <div className="bg-card border rounded-2xl p-5 space-y-2">
                <Button
                  variant={post.isBookmarked ? "default" : "outline"}
                  className="w-full gap-2 cursor-pointer"
                  size="sm"
                  disabled={bookmarkMutation.isPending}
                  onClick={() => requireAuth(() => bookmarkMutation.mutate())}
                >
                  <Bookmark
                    className="w-4 h-4"
                    fill={post.isBookmarked ? "currentColor" : "none"}
                  />
                  {post.isBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
                <Button
                  variant={post.isLiked ? "default" : "outline"}
                  className="w-full gap-2 cursor-pointer"
                  size="sm"
                  disabled={likeMutation.isPending}
                  onClick={() => requireAuth(() => likeMutation.mutate())}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={post.isLiked ? "currentColor" : "none"}
                  />
                  {post.isLiked ? "Liked" : "Like"} (
                  {formatNumber(post.likeCount)})
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 cursor-pointer"
                  size="sm"
                  onClick={() => handleShare("copy")}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button
                  variant="ghost"
                  className="w-full gap-2 cursor-pointer text-muted-foreground"
                  size="sm"
                  onClick={() => requireAuth(() => setReportOpen(true))}
                >
                  <Flag className="w-4 h-4" />
                  Report
                </Button>
              </div>

              {post && (
                <ReportDialog
                  open={reportOpen}
                  onOpenChange={setReportOpen}
                  targetType="post"
                  targetId={post.id}
                />
              )}

              {/* Tags */}
              <div className="bg-card border rounded-2xl p-5">
                <h3 className="text-sm font-bold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <Link key={tag.id} href={`/tags/${tag.slug}`}>
                      <Badge
                        variant="outline"
                        className="text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        #{tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  session,
  replyingTo,
  replyText,
  onReplyTextChange,
  onReplyClick,
  onSubmitReply,
  onLikeComment,
  isReplyPending,
}: {
  comment: Comment;
  session: ReturnType<typeof authClient.useSession>["data"];
  replyingTo: string | null;
  replyText: string;
  onReplyTextChange: (v: string) => void;
  onReplyClick: (id: string) => void;
  onSubmitReply: (parentId: string) => void;
  onLikeComment: (id: string, liked: boolean) => void;
  isReplyPending: boolean;
}) {
  const [reportingId, setReportingId] = useState<string | null>(null);

  return (
    <div className="flex gap-3 p-4 bg-card border rounded-xl">
      <Avatar size="sm">
        <AvatarImage src={comment.author.avatar} />
        <AvatarFallback>{getInitials(comment.author.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold">{comment.author.name}</span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {comment.content}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => onLikeComment(comment.id, Boolean(comment.isLiked))}
            className={`text-xs cursor-pointer flex items-center gap-1 transition-colors ${
              comment.isLiked
                ? "text-danger"
                : "text-muted-foreground hover:text-danger"
            }`}
          >
            <Heart
              className="w-3 h-3"
              fill={comment.isLiked ? "currentColor" : "none"}
            />
            {comment.likeCount}
          </button>
          <button
            onClick={() => onReplyClick(comment.id)}
            className="text-xs cursor-pointer text-muted-foreground hover:text-primary transition-colors"
          >
            Reply
          </button>
          {session && (
            <button
              onClick={() => setReportingId(comment.id)}
              className="text-xs cursor-pointer text-muted-foreground hover:text-danger transition-colors ml-auto"
            >
              Report
            </button>
          )}
        </div>

        <ReportDialog
          open={reportingId === comment.id}
          onOpenChange={(open) => setReportingId(open ? comment.id : null)}
          targetType="comment"
          targetId={comment.id}
        />

        {/* Reply form */}
        {replyingTo === comment.id && (
          <div className="flex gap-2 mt-3">
            <Avatar size="sm" className="w-6 h-6">
              <AvatarImage src={session?.user?.image ?? undefined} />
              <AvatarFallback className="text-[10px]">
                {session ? getInitials(session.user.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1.5">
              <Textarea
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
                placeholder={`Reply to ${comment.author.name}…`}
                className="resize-none h-16 text-sm"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!replyText.trim() || isReplyPending}
                  onClick={() => onSubmitReply(comment.id)}
                  className="cursor-pointer h-7 text-xs"
                >
                  Post Reply
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Replies (one level deep, per AUDIT.md notes on nesting) */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-border space-y-3">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex gap-2">
                <Avatar size="sm" className="w-6 h-6">
                  <AvatarImage src={reply.author.avatar} />
                  <AvatarFallback className="text-[10px]">
                    {getInitials(reply.author.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold">
                      {reply.author.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatRelativeDate(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {reply.content}
                  </p>
                  <button
                    onClick={() =>
                      onLikeComment(reply.id, Boolean(reply.isLiked))
                    }
                    className={`text-[11px] cursor-pointer flex items-center gap-1 mt-1 transition-colors ${
                      reply.isLiked
                        ? "text-danger"
                        : "text-muted-foreground hover:text-danger"
                    }`}
                  >
                    <Heart
                      className="w-2.5 h-2.5"
                      fill={reply.isLiked ? "currentColor" : "none"}
                    />
                    {reply.likeCount}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
