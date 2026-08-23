import { motion } from "framer-motion";
import { Clock, Eye, Heart, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post } from "@/types";
import { formatDate, formatNumber, getInitials } from "@/lib/utils";
import Link from "next/link";

// ─── Blog Card ────────────────────────────────────────────────────────────────

interface BlogCardProps {
  post: Post;
  index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="group bg-card border rounded-2xl overflow-hidden card-hover flex flex-col"
    >
      {/* Image */}
      <Link href={`/blog/${post.slug}`} className="block img-zoom">
        <div className="aspect-video bg-muted">
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
              <span className="text-4xl">📝</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col p-5">
        {/* Category + trending */}
        <div className="flex items-center gap-2 mb-3">
          <Link href={`/categories/${post.category.slug}`}>
            <Badge
              variant="secondary"
              className="text-xs font-semibold hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: `${post.category.color}20`,
                color: post.category.color,
                borderColor: `${post.category.color}30`,
              }}
            >
              {post.category.name}
            </Badge>
          </Link>
          {post.isTrending && (
            <Badge
              variant="secondary"
              className="text-xs bg-warning/15 text-warning-foreground border-warning/20"
            >
              🔥 Trending
            </Badge>
          )}
        </div>

        {/* Title */}
        <Link
          href={`/blog/${post.slug}`}
          className="group/title block mb-2 flex-1"
        >
          <h3 className="font-bold text-base leading-snug group-hover/title:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          {/* Author */}
          <Link
            href={`/authors/${post.author.id}`}
            className="flex items-center gap-2 group/author"
          >
            <Avatar size="sm">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback className="text-xs">
                {getInitials(post.author.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-semibold group-hover/author:text-primary transition-colors leading-tight">
                {post.author.name.split(" ")[0]}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {formatDate(post.publishedAt ?? post.createdAt, "MMM d")}
              </p>
            </div>
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1 text-xs">
              <Clock className="w-3 h-3" />
              {post.readingTime}m
            </span>
            <span className="flex items-center gap-1 text-xs">
              <Eye className="w-3 h-3" />
              {formatNumber(post.viewCount)}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <Heart className="w-3 h-3" />
              {formatNumber(post.likeCount)}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Featured Card ────────────────────────────────────────────────────────────

export function FeaturedCard({ post }: { post: Post }) {
  return (
    <article className="group relative bg-card border rounded-3xl overflow-hidden card-hover">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image */}
        <Link href={`/blog/${post.slug}`} className="block img-zoom order-1">
          <div className="h-56 md:h-full bg-muted">
            {post.featuredImage && (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col justify-between order-2">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary/15 text-primary border-primary/20 text-xs font-semibold">
                ⭐ Featured
              </Badge>
              <Link href={`/categories/${post.category.slug}`}>
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{
                    backgroundColor: `${post.category.color}20`,
                    color: post.category.color,
                  }}
                >
                  {post.category.name}
                </Badge>
              </Link>
            </div>

            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-xl md:text-2xl font-bold leading-snug mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <Link
                href={`/authors/${post.author.id}`}
                className="flex items-center gap-3 group/author"
              >
                <Avatar>
                  <AvatarImage
                    src={post.author.avatar}
                    alt={post.author.name}
                  />
                  <AvatarFallback>
                    {getInitials(post.author.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold group-hover/author:text-primary transition-colors">
                    {post.author.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(post.publishedAt ?? post.createdAt)} ·{" "}
                    {post.readingTime} min read
                  </p>
                </div>
              </Link>

              <Link
                href={`/blog/${post.slug}`}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
              >
                Read <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Blog Card Skeleton ────────────────────────────────────────────────────────

export function BlogCardSkeleton() {
  return (
    <div className="bg-card border rounded-2xl overflow-hidden">
      <Skeleton className="aspect-video rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-2.5 w-14" />
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Author Card ─────────────────────────────────────────────────────────────

export function AuthorCard({ author }: { author: Post["author"] }) {
  return (
    <Link
      href={`/authors/${author.id}`}
      className="group block bg-card border rounded-2xl p-5 card-hover text-center"
    >
      <Avatar size="lg" className="mx-auto mb-3">
        <AvatarImage src={author.avatar} alt={author.name} />
        <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
      </Avatar>
      <h3 className="font-bold text-sm group-hover:text-primary transition-colors">
        {author.name}
      </h3>
      <p className="text-xs text-muted-foreground mt-1">{author.role}</p>
      {author.postCount > 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          {author.postCount} articles
        </p>
      )}
    </Link>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  colorClass?: string;
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  colorClass = "stat-card-blue",
  description,
}: StatCardProps) {
  return (
    <div className={`rounded-2xl border p-5 ${colorClass}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold mt-1">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-background/60 flex items-center justify-center">
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1">
          <span
            className={`text-xs font-semibold ${change >= 0 ? "text-success" : "text-danger"}`}
          >
            {change >= 0 ? "+" : ""}
            {change}%
          </span>
          <span className="text-xs text-muted-foreground">
            {description ?? "from last month"}
          </span>
        </div>
      )}
    </div>
  );
}
