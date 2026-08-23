import type { MetadataRoute } from "next";
import { prisma } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Reads real data — Post/Category/Tag all predate the unverified schema
// rounds in AUDIT.md, so this doesn't carry the same "unrun migration"
// risk as everything added since. Only published, non-deleted posts are
// included (never drafts/scheduled/archived), matching the original
// prompt's own instruction to never include private/draft content here.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://quilbyte.vercel.app";

  let posts: { slug: string; updatedAt: Date }[] = [];
  let categories: { slug: string; updatedAt: Date }[] = [];
  let tags: { slug: string }[] = [];

  try {
    [posts, categories, tags] = await Promise.all([
      prisma.post.findMany({
        where: { status: "PUBLISHED", isDeleted: false },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.category.findMany({
        where: { isDeleted: false },
        select: { slug: true, updatedAt: true },
      }),
      prisma.tag.findMany({
        where: { isDeleted: false },
        select: { slug: true },
      }),
    ]);
  } catch (error) {
    console.error("Unable to load dynamic sitemap entries:", error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },

    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),

    ...tags.map((tag) => ({
      url: `${baseUrl}/tags/${tag.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
