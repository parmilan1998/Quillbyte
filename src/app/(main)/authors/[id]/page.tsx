"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  AtSign,
  Code2,
  Globe,
  Users,
  FileText,
  MapPin,
  CheckCircle2,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  TrendingUp,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogCard, BlogCardSkeleton } from "@/components/cards";
import { PageBreadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { formatNumber, formatDate, getInitials } from "@/lib/utils";
import { ROLE_COLORS } from "@/constants";
import { useParams, useRouter } from "next/navigation";
import { AuthorService } from "@/services/client/author-service";
import { postService } from "@/services/client/post-service";
import { authClient } from "@/lib/client";
import { toast } from "sonner";
import Link from "next/link";

export default function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const [tab, setTab] = useState("all");

  const { data: author, isLoading: authorLoading } = useQuery({
    queryKey: ["author", id],
    queryFn: () => AuthorService.getById(id!),
    enabled: !!id,
  });

  const followMutation = useMutation({
    mutationFn: () =>
      author!.isFollowing
        ? AuthorService.unfollow(author!.id)
        : AuthorService.follow(author!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["author", id] });
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const handleFollowClick = () => {
    if (!session) {
      toast.info("Sign in to follow authors.");
      router.push("/auth/sign-in");
      return;
    }
    if (session.user.id === author?.id) {
      toast.info("You can't follow yourself.");
      return;
    }
    followMutation.mutate();
  };

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["posts", "author", id],
    queryFn: () => postService.getPosts({ author: id, limit: 20 }),
    enabled: !!id,
  });

  const posts = postsData?.data ?? [];

  const filteredPosts =
    tab === "all" ? posts : posts.filter((p) => p.status === tab);

  const totalViews = posts.reduce((s, p) => s + p.viewCount, 0);
  const totalLikes = posts.reduce((s, p) => s + p.likeCount, 0);
  const totalComments = posts.reduce((s, p) => s + p.commentCount, 0);

  if (authorLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6 page-enter">
        <Skeleton className="h-5 w-48" />
        <div className="flex items-start gap-6">
          <Skeleton className="w-24 h-24 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <EmptyState
        className="py-24"
        title="Author not found"
        description="This author profile doesn't exist or has been removed."
        action={{
          label: "View all authors",
          onClick: () => window.history.back(),
        }}
      />
    );
  }

  return (
    <div className="page-enter">
      {/* Hero / Profile header */}
      <section className="bg-card border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-10">
          <PageBreadcrumb
            items={[
              { label: "Authors", href: "/authors" },
              { label: author.name },
            ]}
            className="mb-8"
          />

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback className="text-2xl font-bold">
                  {getInitials(author.name)}
                </AvatarFallback>
              </Avatar>
              {author.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {author.name}
                </h1>
                <Badge
                  className={`capitalize border ${ROLE_COLORS[author.role]}`}
                >
                  {author.role}
                </Badge>
                {author.isVerified && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    ✓ Verified Author
                  </Badge>
                )}
              </div>

              {author.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3">
                  <MapPin className="w-3.5 h-3.5" /> {author.location}
                </p>
              )}

              {author.bio && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-xl">
                  {author.bio}
                </p>
              )}

              {/* Social links */}
              <div className="flex flex-wrap gap-3 mb-5">
                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" /> Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {author.twitterHandle && (
                  <a
                    href={`https://twitter.com/${author.twitterHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <AtSign className="w-3.5 h-3.5" /> @{author.twitterHandle}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {author.githubHandle && (
                  <a
                    href={`https://github.com/${author.githubHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5" /> {author.githubHandle}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {author.linkedinHandle && (
                  <a
                    href={`https://linkedin.com/in/${author.linkedinHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <FileText className="w-4 h-4 text-primary/60" />
                  <strong className="text-foreground">
                    {posts.length}
                  </strong>{" "}
                  articles
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="w-4 h-4 text-violet/60" />
                  <strong className="text-foreground">
                    {formatNumber(author.followerCount)}
                  </strong>{" "}
                  followers
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Eye className="w-4 h-4 text-sky/60" />
                  <strong className="text-foreground">
                    {formatNumber(totalViews)}
                  </strong>{" "}
                  total views
                </div>
                {author.createdAt && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDate(author.createdAt, "MMM yyyy")}
                  </div>
                )}
              </div>
            </div>

            {/* Follow button */}
            <div className="shrink-0">
              <Button
                variant={author.isFollowing ? "outline" : "default"}
                className="gap-2 cursor-pointer"
                disabled={followMutation.isPending}
                onClick={handleFollowClick}
              >
                <Users className="w-4 h-4" />
                {author.isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Author stats bar */}
      <section className="border-b bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              {
                label: "Articles",
                value: posts.length,
                icon: BookOpen,
                color: "text-primary",
              },
              {
                label: "Total Views",
                value: formatNumber(totalViews),
                icon: Eye,
                color: "text-sky",
              },
              {
                label: "Total Likes",
                value: formatNumber(totalLikes),
                icon: Heart,
                color: "text-danger",
              },
              {
                label: "Comments",
                value: formatNumber(totalComments),
                icon: MessageSquare,
                color: "text-success",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-card border rounded-xl py-3 px-4">
                <div
                  className={`flex items-center justify-center gap-1.5 mb-1 ${color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-lg font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">
          {/* Posts */}
          <div>
            <Tabs value={tab} onValueChange={setTab} className="flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Articles</h2>
                <TabsList>
                  <TabsTrigger value="all">All ({posts.length})</TabsTrigger>
                  <TabsTrigger value="published">
                    Published (
                    {posts.filter((p) => p.status === "published").length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={tab}>
                {postsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <BlogCardSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <EmptyState
                    title="No articles yet"
                    description={`${author.name} hasn't published any articles in this category.`}
                    icon={
                      <FileText className="w-8 h-8 text-muted-foreground/40" />
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {filteredPosts.map((post, idx) => (
                      <BlogCard key={post.id} post={post} index={idx} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Categories written about */}
            {posts.length > 0 && (
              <div className="bg-card border rounded-2xl p-5">
                <h3 className="text-sm font-bold mb-3">Topics Covered</h3>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(new Set(posts.map((p) => p.category.id)))
                    .map(
                      (catId) =>
                        posts.find((p) => p.category.id === catId)?.category,
                    )
                    .filter(Boolean)
                    .map((cat) => (
                      <Link key={cat!.id} href={`/categories/${cat!.slug}`}>
                        <Badge
                          variant="secondary"
                          className="text-xs hover:opacity-80 transition-opacity cursor-pointer"
                          style={{
                            backgroundColor: `${cat!.color}18`,
                            color: cat!.color,
                            borderColor: `${cat!.color}30`,
                          }}
                        >
                          {cat!.name}
                        </Badge>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Top post */}
            {posts.length > 0 && (
              <div className="bg-card border rounded-2xl p-5">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Most Popular
                </h3>
                {[...posts]
                  .sort((a, b) => b.viewCount - a.viewCount)
                  .slice(0, 3)
                  .map((post, idx) => (
                    <div key={post.id} className="flex gap-3 mb-3 last:mb-0">
                      <span className="text-lg font-bold text-muted-foreground/30 w-6 shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-xs font-medium hover:text-primary transition-colors line-clamp-2 leading-relaxed"
                        >
                          {post.title}
                        </Link>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {formatNumber(post.viewCount)} views
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* CTA: Follow */}
            <div className="bg-linear-href-br from-primary/10 href-violet/10 border border-primary/20 rounded-2xl p-5 text-center">
              <Avatar className="w-12 h-12 mx-auto mb-3">
                <AvatarImage src={author.avatar} />
                <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
              </Avatar>
              <p className="text-sm font-semibold mb-1">
                {author.name.split(" ")[0]}'s Newsletter
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Get notified when {author.name.split(" ")[0]} publishes a new
                article.
              </p>
              <Button
                size="sm"
                variant={author.isFollowing ? "outline" : "default"}
                className="w-full cursor-pointer"
                disabled={followMutation.isPending}
                onClick={handleFollowClick}
              >
                {author.isFollowing ? "Following" : "Follow Author"}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
