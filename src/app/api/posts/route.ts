import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { requireRole } from "@/lib/api-auth";
import { estimateReadingTime } from "@/lib/utils";
import { auth, prisma } from "@/lib/auth";
import { buildPostInclude, serializePost } from "@/lib/post-query";
import { logActivity } from "@/lib/activity-log";

const POST_STATUSES = ["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"] as const;

const createPostSchema = z
  .object({
    title: z.string().min(5),
    slug: z.string().min(3),
    excerpt: z.string().min(20).max(300),
    content: z.string().min(50),
    categoryId: z.string().min(1),
    authorId: z.string().min(1).optional(),
    status: z.enum(POST_STATUSES),
    isFeatured: z.boolean().default(false),
    isTrending: z.boolean().default(false),
    scheduledAt: z.string().optional().nullable(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    tagIds: z.array(z.string()).default([]),
    featuredImageUrl: z.string().url().optional().nullable(),
    featuredImageId: z.string().optional().nullable(),
  })
  .refine((data) => data.status !== "SCHEDULED" || Boolean(data.scheduledAt), {
    message: "scheduledAt is required when status is SCHEDULED",
    path: ["scheduledAt"],
  });

export async function GET(request: NextRequest) {
  // Session is optional here — GET is public — but it determines whether
  // the caller is allowed to see anything other than published posts.
  const session = await auth.api.getSession({ headers: await headers() });
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "ADMIN";

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");
  const categorySlug = searchParams.get("category");
  const tagSlug = searchParams.get("tag");
  const authorId = searchParams.get("authorId");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Number(searchParams.get("pageSize") ?? "10"));

  const requestedStatus = status
    ? (status.toUpperCase() as (typeof POST_STATUSES)[number])
    : undefined;

  // A caller may only request non-published statuses (DRAFT/SCHEDULED/
  // ARCHIVED) if they're an admin, or if they're filtering to their own
  // authorId. Everyone else — including anonymous callers — only ever
  // sees published posts, regardless of what "status" they pass.
  const isOwnPosts = Boolean(session?.user?.id) && authorId === session?.user?.id;
  const statusFilter =
    requestedStatus && (isAdmin || isOwnPosts)
      ? { status: requestedStatus }
      : { status: "PUBLISHED" as const };

  const where = {
    ...statusFilter,
    isDeleted: false,
    ...(categoryId ? { categoryId } : {}),
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(tagSlug ? { tags: { some: { tag: { slug: tagSlug } } } } : {}),
    ...(authorId ? { authorId } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { excerpt: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "views"
        ? { viewCount: "desc" as const }
        : sort === "likes"
          ? { likes: { _count: "desc" as const } }
          : { createdAt: "desc" as const };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: buildPostInclude(session?.user?.id),
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({
    posts: posts.map(serializePost),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

export async function POST(request: NextRequest) {
  const { session, response: authError } = await requireRole();
  if (authError) return authError;

  const json = await request.json();
  const parsed = createPostSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const isAdmin = (session!.user as { role?: string }).role === "ADMIN";

  // Only admins may assign a post to someone else. Everyone else always
  // authors their own posts, regardless of what authorId they send.
  const authorId = isAdmin && data.authorId ? data.authorId : session!.user.id;

  // Guard against a slug collision instead of letting the unique
  // constraint throw a raw 500.
  const existing = await prisma.post.findUnique({ where: { slug: data.slug } });
  const slug = existing ? `${data.slug}-${Date.now().toString(36)}` : data.slug;

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      categoryId: data.categoryId,
      authorId,
      status: data.status,
      isFeatured: data.isFeatured,
      isTrending: data.isTrending,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.excerpt,
      readingTime: estimateReadingTime(data.content),
      featuredImageUrl: data.featuredImageUrl ?? null,
      featuredImageId: data.featuredImageId ?? null,
      tags: {
        create: data.tagIds.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      },
    },
    include: buildPostInclude(session!.user.id),
  });

  await logActivity({
    userId: session!.user.id,
    action: data.status === "PUBLISHED" ? "published" : "created",
    resource: "post",
    resourceId: post.id,
    details: post.title,
  });

  return NextResponse.json(
    { success: true, post: serializePost(post) },
    { status: 201 },
  );
}
