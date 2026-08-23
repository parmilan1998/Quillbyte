"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  FolderOpen,
  ArrowRight,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageBreadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { CategoryService } from "@/services/client/category-service";
import { postService } from "@/services/client/post-service";
import Link from "next/link";

const CATEGORY_ICONS = ["⚛️", "🔷", "🎨", "🐋", "🤖", "💅", "🟢", "💼"];

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAll(),
  });

  // Fetched once and filtered client-side per category below, rather than
  // firing a separate request per featured-card preview.
  const { data: recentPosts } = useQuery({
    queryKey: ["posts", "recent-by-category-preview"],
    queryFn: () => postService.getPosts({ status: "published", limit: 50 }),
  });

  const filtered = allCategories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const totalPosts = allCategories.reduce((s, c) => s + c.postCount, 0);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="hero-bg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12">
          <PageBreadcrumb items={[{ label: "Categories" }]} className="mb-6" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-primary" />
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                  {allCategories.length} Categories
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Browse by Category
              </h1>
              <p className="text-muted-foreground">
                Explore {totalPosts}+ articles across {allCategories.length}{" "}
                topics — from React href AI, DevOps href career growth.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search categories…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            {[
              { label: "Total Articles", value: totalPosts, icon: BookOpen },
              {
                label: "Categories",
                value: allCategories.length,
                icon: FolderOpen,
              },
              { label: "Trending Topics", value: 3, icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary/60" />
                <span className="font-semibold text-foreground">{value}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {filtered.length === 0 ? (
          <EmptyState
            title="No categories found"
            description={`No categories match "${search}"`}
            action={{ label: "Clear search", onClick: () => setSearch("") }}
          />
        ) : (
          <>
            {/* Featured large cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filtered.slice(0, 3).map((cat, idx) => {
                const catPosts = (recentPosts?.data ?? [])
                  .filter((p) => p.category.id === cat.id)
                  .slice(0, 2);

                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="group relative bg-card border rounded-2xl overflow-hidden card-hover flex flex-col"
                    style={{ borderTopColor: cat.color, borderTopWidth: 3 }}
                  >
                    {/* Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${cat.color}18` }}
                        >
                          {CATEGORY_ICONS[idx] ?? "📁"}
                        </div>
                        <Badge
                          className="text-xs font-semibold"
                          style={{
                            backgroundColor: `${cat.color}18`,
                            color: cat.color,
                            borderColor: `${cat.color}30`,
                          }}
                        >
                          {cat.postCount} articles
                        </Badge>
                      </div>
                      <h2
                        className="text-xl font-bold mb-2 group-hover:text-(--cat-color) transition-colors"
                        style={
                          { "--cat-color": cat.color } as React.CSSProperties
                        }
                      >
                        {cat.name}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    </div>

                    {/* Recent posts preview */}
                    {catPosts.length > 0 && (
                      <div className="px-6 pb-2 flex-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Recent
                        </p>
                        <div className="space-y-2">
                          {catPosts.map((post) => (
                            <Link
                              key={post.id}
                              href={`/blog/${post.slug}`}
                              className="block text-xs text-muted-foreground hover:text-primary transition-colors line-clamp-1 leading-relaxed"
                            >
                              → {post.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-6 pt-4 mt-auto">
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="flex items-center gap-1.5 text-sm font-semibold hover:gap-3 transition-all"
                        style={{ color: cat.color }}
                      >
                        Explore {cat.name}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Remaining categories grid */}
            {filtered.length > 3 && (
              <>
                <h2 className="text-lg font-bold mb-5 text-muted-foreground">
                  More Categories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filtered.slice(3).map((cat, idx) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                    >
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="group block bg-card border rounded-2xl p-5 card-hover text-center"
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl"
                          style={{ backgroundColor: `${cat.color}18` }}
                        >
                          {CATEGORY_ICONS[idx + 3] ?? "📁"}
                        </div>
                        <h3
                          className="font-bold text-sm mb-1 group-hover:text-(--cat-color) transition-colors"
                          style={
                            { "--cat-color": cat.color } as React.CSSProperties
                          }
                        >
                          {cat.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {cat.description}
                        </p>
                        <span
                          className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${cat.color}15`,
                            color: cat.color,
                          }}
                        >
                          {cat.postCount} articles
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-gradient-href-br from-primary/8 via-transparent href-violet/8 border rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Can't find what you're looking for?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Use search href find specific articles or suggest a new category
            topic.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Search className="w-4 h-4" />
              Search Articles
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold hover:bg-accent transition-colors"
            >
              Suggest a Topic
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
