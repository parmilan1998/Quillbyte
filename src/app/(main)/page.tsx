"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  TrendingUp,
  Zap,
  Star,
  BookOpen,
  Mail,
  ChevronRight,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlogCard, FeaturedCard, BlogCardSkeleton } from "@/components/cards";
import { getInitials } from "@/lib/utils";
import { SITE } from "@/constants";
import { CategoryService } from "@/services/client/category-service";
import { TagService } from "@/services/client/tag-service";
import { AuthorService } from "@/services/client/author-service";
import { NewsletterService } from "@/services/client/newsletter-service";
import { toast } from "sonner";
import { postService } from "@/services/client/post-service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TESTIMONIALS = [
  {
    name: "Sofia Martinez",
    role: "Senior Frontend Engineer",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=sofia",
    content:
      "Quillbyte has become my go-to resource for staying current with React and TypeScript. The quality of articles is unmatched.",
  },
  {
    name: "James Park",
    role: "Fullstack Developer",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=james",
    content:
      "I've learned more from Quillbyte in 3 months than from years of tutorials. The depth and clarity of each post is incredible.",
  },
  {
    name: "Emma Johnson",
    role: "Lead Developer",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=emma",
    content:
      "Every article is practical, well-researched, and immediately applicable to real projects. Essential reading for modern devs.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Is Quillbyte free?",
    a: "Yes! All articles are completely free to read. We also offer a premium newsletter with exclusive content.",
  },
  {
    q: "Can I contribute articles?",
    a: "Absolutely. Apply for author access through your dashboard. We welcome quality contributions from the community.",
  },
  {
    q: "How often is new content published?",
    a: "We publish 3–5 new articles per week across all categories.",
  },
  {
    q: "Can I suggest article topics?",
    a: "Yes! Use the contact form or submit suggestions via GitHub discussions.",
  },
  {
    q: "Is there a newsletter?",
    a: "Yes, subscribe for a weekly digest of the best articles, curated just for you.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const { data: featuredPosts, isLoading: featuredLoading } = useQuery({
    queryKey: ["posts", "featured"],
    queryFn: () => postService.getFeaturedPosts(),
  });

  const { data: latestPosts, isLoading: latestLoading } = useQuery({
    queryKey: ["posts", "latest"],
    queryFn: () => postService.getLatestPosts(6),
  });

  const { data: trendingPosts } = useQuery({
    queryKey: ["posts", "trending"],
    queryFn: () => postService.getTrendingPosts(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAll(),
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => TagService.getAll(),
  });

  const { data: featuredAuthors = [] } = useQuery({
    queryKey: ["authors", "featured"],
    queryFn: () => AuthorService.getFeatured(4),
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    const result = await NewsletterService.subscribe(email.trim());
    if (result.success) {
      setSubscribed(true);
      toast.success("You're subscribed!");
      setEmail("");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="page-enter">
      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="hero-bg relative overflow-hidden border-b py-10 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.div
            className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.85fr)] gap-12 lg:gap-20 items-center"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-sm font-bold tracking-tight text-foreground">
                  {SITE.name}
                </span>
                <span className="h-px w-16 bg-primary/50" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Volume 01 · 2026
                </span>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-5">
                The engineering reading room
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-7 leading-[0.94] max-w-2xl">
                Read deeply.
                <span className="block gradient-text">Build clearly.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Practical thinking for modern builders: thoughtful articles on
                React, TypeScript, AI, infrastructure, and the craft behind
                great software.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  size="lg"
                  className="gap-2 px-6 rounded-xl cursor-pointer"
                  onClick={() => router.push("/blog")}
                >
                  <BookOpen className="w-4 h-4" />
                  Start Reading
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 px-6 rounded-xl cursor-pointer"
                  onClick={() => router.push("/auth/register")}
                >
                  <Zap className="w-4 h-4" />
                  Write for Us
                </Button>
              </div>

              {/* Social proof */}
              <div className="mt-12 pt-5 border-t max-w-md flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {featuredAuthors.map((u) => (
                    <Avatar
                      key={u.id}
                      size="sm"
                      className="border-2 border-background"
                    >
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span>
                  Join <strong className="text-foreground">4,200+</strong>{" "}
                  developers reading weekly
                </span>
              </div>
            </div>

            <div className="relative min-h-70 sm:min-h-90 lg:min-h-105 lg:translate-y-5">
              {featuredPosts?.[0]?.featuredImage ? (
                <Link
                  href={`/blog/${featuredPosts[0].slug}`}
                  className="group block h-full"
                >
                  <div className="h-full min-h-70 sm:min-h-90 lg:min-h-105 overflow-hidden rounded-[1.75rem] bg-muted shadow-2xl shadow-primary/10">
                    <img
                      src={featuredPosts[0].featuredImage}
                      alt={featuredPosts[0].title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 bg-background/95 backdrop-blur-sm border p-5 rounded-2xl shadow-lg shadow-foreground/5">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-primary font-bold">
                        Editor's pick
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {featuredPosts[0].readingTime} min read
                      </span>
                    </div>
                    <h2 className="font-bold leading-snug line-clamp-2">
                      {featuredPosts[0].title}
                    </h2>
                  </div>
                </Link>
              ) : (
                <div className="h-full min-h-70 rounded-4xl bg-primary/10 border border-primary/20" />
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────────────────────── */}
      <section className="border-y bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Articles Published", value: "127+", icon: "📝" },
              { label: "Monthly Readers", value: "18K+", icon: "👀" },
              { label: "Authors", value: "12", icon: "✍️" },
              { label: "Newsletter Subscribers", value: "4.2K+", icon: "📧" },
            ].map(({ label, value, icon }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center"
              >
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured ──────────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span className="text-xs font-semibold text-warning uppercase tracking-wide">
                Featured
              </span>
            </div>
            <h2 className="text-2xl font-bold">Editor's Picks</h2>
          </div>
          <Link
            href="/blog?featured=true"
            className="text-sm text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredLoading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-64 bg-muted animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {featuredPosts?.map((post) => (
              <FeaturedCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* ─── Latest ────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Latest
                </span>
              </div>
              <h2 className="text-2xl font-bold">Fresh from the Blog</h2>
            </div>
            <Link
              href="/blog"
              className="text-sm text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              All posts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {latestLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
              {latestPosts?.map((post, idx) => (
                <BlogCard key={post.id} post={post} index={idx} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-xl px-8 cursor-pointer"
            >
              <Link href="/blog">
                Browse All Articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Trending ──────────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-danger" />
          <span className="text-xs font-semibold text-danger uppercase tracking-wide">
            Trending
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-8">What Everyone's Reading</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingPosts?.slice(0, 4).map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-center gap-4 p-4 bg-card border rounded-2xl hover:border-primary/30 transition-all card-hover"
              >
                <div className="text-3xl font-bold text-muted-foreground/20 w-10 shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <Badge
                    variant="secondary"
                    className="text-[10px] mb-1.5"
                    style={{
                      backgroundColor: `${post.category.color}20`,
                      color: post.category.color,
                    }}
                  >
                    {post.category.name}
                  </Badge>
                  <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span>🔥 {post.viewCount.toLocaleString()} views</span>
                    <span>❤️ {post.likeCount}</span>
                    <span>⏱ {post.readingTime}m</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Categories ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Browse by Category</h2>
            <p className="text-muted-foreground text-sm">
              Explore topics that interest you most
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 stagger">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group block bg-card border rounded-2xl p-5 text-center card-hover hover:border-(--cat-color)/40 transition-all"
                  style={{ "--cat-color": cat.color } as React.CSSProperties}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    {["⚛️", "🔷", "🎨", "🐋", "🤖", "🎨", "🟢", "💼"][idx] ||
                      "📁"}
                  </div>
                  <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {cat.postCount} articles
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Popular Tags ──────────────────────────────────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl font-bold mb-6">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`}>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all text-sm px-3 py-1 rounded-full font-medium"
              >
                #{tag.name}
                <span className="ml-1.5 text-muted-foreground text-xs">
                  {tag.postCount}
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Newsletter ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-linear-to-br from-primary/8 via-background to-violet/8 border-y">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Stay in the Loop</h2>
            <p className="text-muted-foreground mb-8">
              Get the best developer articles delivered to your inbox every
              week. No spam, just quality content.
            </p>
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-success/10 border border-success/20 rounded-2xl p-6"
              >
                <p className="text-success font-semibold text-lg">
                  🎉 You're subscribed!
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Welcome to the community — new posts will be added to future
                  digests.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-11 rounded-xl"
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-xl shrink-0 cursor-pointer"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
            <p className="text-xs text-muted-foreground mt-3">
              Join 4,200+ developers · Unsubscribe anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Testimonials ──────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Loved by Developers</h2>
          <p className="text-muted-foreground text-sm">What our readers say</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border rounded-2xl p-6 relative"
            >
              <Quote className="w-6 h-6 text-primary/30 mb-3" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t.content}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t">
                <Avatar size="sm">
                  <AvatarImage src={t.avatar} />
                  <AvatarFallback>{getInitials(t.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm">
              Everything you need to know about Quillbyte
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-card border rounded-xl px-4"
              >
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-linear-to-br from-primary to-violet p-10 rounded-3xl text-white"
          >
            <h2 className="text-3xl font-bold mb-3">Ready to level up?</h2>
            <p className="text-white/80 mb-8">
              Create an account to save articles, track your reading, write your
              own posts, and join the community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-xl px-8 cursor-pointer"
                onClick={() => router.push("/auth/register")}
              >
                Create Free Account
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="rounded-xl text-white hover:bg-white/15 cursor-pointer"
                onClick={() => router.push("/blog")}
              >
                Browse First
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
