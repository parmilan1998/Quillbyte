"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  ArrowRight,
  FileText,
  MapPin,
  AtSign,
  Code2,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageBreadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { AuthorService } from "@/services/client/author-service";
import { formatNumber, getInitials } from "@/lib/utils";
import { ROLE_COLORS } from "@/constants";
import Link from "next/link";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  author: "Author",
  user: "Member",
};

export default function AuthorsPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const { data: allUsers = [] } = useQuery({
    queryKey: ["authors"],
    queryFn: () => AuthorService.getAll(),
  });

  // "Writers" here means anyone who has actually published something — the
  // database only distinguishes USER/ADMIN (no separate editor/author
  // role — see AUDIT.md), so post count is the meaningful signal for who
  // belongs on this page, not role.
  const writers = allUsers.filter((u) => u.postCount > 0);

  const filtered = writers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.bio ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (u.location ?? "").toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" || u.role === tab;
    return matchSearch && matchTab;
  });

  // Sorted by post count, not followers — follower counts aren't backed by
  // real data yet (see AUDIT.md) and are always 0.
  const topAuthor = [...writers].sort((a, b) => b.postCount - a.postCount)[0];

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="hero-bg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12">
          <PageBreadcrumb items={[{ label: "Authors" }]} className="mb-6" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet/15 flex items-center justify-center">
                  <Users className="w-5 h-5 text-violet" />
                </div>
                <Badge className="bg-violet/10 text-violet border-violet/20 text-xs font-semibold">
                  {writers.length} Contributors
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Meet the Authors
              </h1>
              <p className="text-muted-foreground">
                Practitioners who ship code and share knowledge. Real
                experience, real insights.
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search authors…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured author */}
      {topAuthor && !search && tab === "all" && (
        <section className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span className="text-xs font-semibold uppercase tracking-wide text-warning">
                Top Contributor
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-linear-href-br from-primary/8 href-violet/8 border border-primary/20 rounded-2xl"
            >
              <div className="relative">
                <Avatar className="w-20 h-20 border-2 border-primary/30">
                  <AvatarImage src={topAuthor.avatar} alt={topAuthor.name} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(topAuthor.name)}
                  </AvatarFallback>
                </Avatar>
                {topAuthor.isVerified && (
                  <CheckCircle2 className="absolute -bottom-1 -right-1 w-6 h-6 text-primary fill-background" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{topAuthor.name}</h2>
                  <Badge
                    className={`capitalize border text-xs ${ROLE_COLORS[topAuthor.role]}`}
                  >
                    {ROLE_LABELS[topAuthor.role]}
                  </Badge>
                </div>
                {topAuthor.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3" /> {topAuthor.location}
                  </p>
                )}
                <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                  {topAuthor.bio}
                </p>
                <div className="flex flex-wrap gap-5 mt-3 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <FileText className="w-3.5 h-3.5" />
                    <strong className="text-foreground">
                      {topAuthor.postCount}
                    </strong>{" "}
                    articles
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <strong className="text-foreground">
                      {formatNumber(topAuthor.followerCount)}
                    </strong>{" "}
                    followers
                  </span>
                  {topAuthor.twitterHandle && (
                    <a
                      href={`https://twitter.com/${topAuthor.twitterHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary text-xs hover:underline"
                    >
                      <AtSign className="w-3 h-3" />@{topAuthor.twitterHandle}
                    </a>
                  )}
                </div>
              </div>
              <Link
                href={`/authors/${topAuthor.id}`}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                View Profile <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* All authors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Tabs value={tab} onValueChange={setTab} className="flex flex-col">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <TabsList>
              <TabsTrigger value="all">All ({writers.length})</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
              <TabsTrigger value="author">Authors</TabsTrigger>
            </TabsList>
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </p>
          </div>

          <TabsContent value={tab}>
            {filtered.length === 0 ? (
              <EmptyState
                title="No authors found"
                description={
                  search
                    ? `No authors match "${search}"`
                    : "No authors in this category."
                }
                action={
                  search
                    ? { label: "Clear search", onClick: () => setSearch("") }
                    : undefined
                }
                icon={<Users className="w-8 h-8 text-muted-foreground/40" />}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((author, idx) => (
                  <motion.div
                    key={author.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <Link
                      href={`/authors/${author.id}`}
                      className="group block bg-card border rounded-2xl p-6 card-hover h-full"
                    >
                      {/* Avatar + verified */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="relative">
                          <Avatar className="w-14 h-14 border-2 border-border">
                            <AvatarImage
                              src={author.avatar}
                              alt={author.name}
                            />
                            <AvatarFallback className="text-lg">
                              {getInitials(author.name)}
                            </AvatarFallback>
                          </Avatar>
                          {author.isVerified && (
                            <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 text-primary fill-background" />
                          )}
                        </div>
                        <Badge
                          className={`capitalize border text-[11px] ${ROLE_COLORS[author.role]}`}
                        >
                          {ROLE_LABELS[author.role]}
                        </Badge>
                      </div>

                      {/* Info */}
                      <h3 className="font-bold text-base mb-0.5 group-hover:text-primary transition-colors">
                        {author.name}
                      </h3>
                      {author.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" /> {author.location}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                        {author.bio}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs pt-4 border-t border-border/60">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <FileText className="w-3.5 h-3.5" />
                          <strong className="text-foreground">
                            {author.postCount}
                          </strong>{" "}
                          posts
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-3.5 h-3.5" />
                          <strong className="text-foreground">
                            {formatNumber(author.followerCount)}
                          </strong>
                        </span>
                      </div>

                      {/* Social links */}
                      {(author.twitterHandle || author.githubHandle) && (
                        <div className="flex gap-2 mt-3">
                          {author.twitterHandle && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <AtSign className="w-3 h-3" />
                              {author.twitterHandle}
                            </span>
                          )}
                          {author.githubHandle && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <Code2 className="w-3 h-3" />
                              {author.githubHandle}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Join CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center bg-gradient-href-br from-violet/8 via-transparent href-primary/8 border rounded-3xl p-10">
          <div className="text-4xl mb-4">✍️</div>
          <h2 className="text-2xl font-bold mb-2">
            Want href write for Quillbyte?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm leading-relaxed">
            Share your expertise with thousands of developers. We welcome
            experienced engineers href contribute articles on React, TypeScript,
            AI, and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Apply as Author <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border font-semibold text-sm hover:bg-accent transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
