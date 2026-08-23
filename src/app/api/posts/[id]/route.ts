import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth, prisma } from "@/lib/auth";
import { requireSession } from "@/lib/api-auth";
import { estimateReadingTime } from "@/lib/utils";
import { buildPostInclude, serializePost } from "@/lib/post-query";
import { logActivity } from "@/lib/activity-log";

const POST_STATUSES = ["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"] as const;

const updatePostSchema = z
  .object({
    title: z.string().min(5).optional(),
    slug: z.string().min(3).optional(),
    excerpt: z.string().min(20).max(300).optional(),
    content: z.string().min(50).optional(),
    categoryId: z.string().min(1).optional(),
    authorId: z.string().min(1).optional(),
    status: z.enum(POST_STATUSES).optional(),
    isFeatured: z.boolean().optional(),
    isTrending: z.boolean().optional(),
    scheduledAt: z.string().optional().nullable(),
    seoTitle: z.string().optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    tagIds: z.array(z.string()).optional(),
    featuredImageUrl: z.string().url().optional().nullable(),
    featuredImageId: z.string().optional().nullable(),
  })
  .refine((data) => data.status !== "SCHEDULED" || Boolean(data.scheduledAt), {
    message: "scheduledAt is required when status is SCHEDULED",
    path: ["scheduledAt"],
  });

// ─── GET /api/posts/:id ────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  const post = await prisma.post.findUnique({
    where: { id, isDeleted: false },
    include: buildPostInclude(session?.user?.id),
  });

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  // Non-published posts are only visible to their author or an admin.
  if (post.status !== "PUBLISHED") {
    const role = (session?.user as { role?: string } | undefined)?.role;
    const isOwner = session?.user?.id === post.authorId;

    if (!session || (!isOwner && role !== "ADMIN")) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
  }

  return NextResponse.json({ post: serializePost(post) });
}

// ─── PATCH /api/posts/:id ──────────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const { id } = await params;

  const existing = await prisma.post.findUnique({ where: { id, isDeleted: false } });
  if (!existing) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  const role = (session!.user as { role?: string }).role;
  const isAdmin = role === "ADMIN";
  const isOwner = existing.authorId === session!.user.id;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const json = await request.json();
  const parsed = updatePostSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Only admins may reassign a post to a different author.
  const authorId = isAdmin && data.authorId ? data.authorId : undefined;

  // Guard slug collision if slug is being changed.
  if (data.slug && data.slug !== existing.slug) {
    const slugConflict = await prisma.post.findUnique({ where: { slug: data.slug } });
    if (slugConflict) {
      return NextResponse.json(
        { message: "A post with this slug already exists" },
        { status: 409 },
      );
    }
  }

  // publishedAt: set the first time a post transitions into PUBLISHED,
  // don't clobber it on subsequent edits of an already-published post.
  const isNewlyPublished = data.status === "PUBLISHED" && existing.status !== "PUBLISHED";

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),
      ...(data.content !== undefined
        ? { content: data.content, readingTime: estimateReadingTime(data.content) }
        : {}),
      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
      ...(authorId ? { authorId } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
      ...(data.isTrending !== undefined ? { isTrending: data.isTrending } : {}),
      ...(data.scheduledAt !== undefined
        ? { scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null }
        : {}),
      ...(isNewlyPublished ? { publishedAt: new Date() } : {}),
      ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
      ...(data.seoDescription !== undefined
        ? { seoDescription: data.seoDescription }
        : {}),
      ...(data.featuredImageUrl !== undefined
        ? { featuredImageUrl: data.featuredImageUrl }
        : {}),
      ...(data.featuredImageId !== undefined
        ? { featuredImageId: data.featuredImageId }
        : {}),
      ...(data.tagIds !== undefined
        ? {
            tags: {
              deleteMany: {},
              create: data.tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
            },
          }
        : {}),
    },
    include: buildPostInclude(session!.user.id),
  });

  if (isNewlyPublished) {
    await logActivity({
      userId: session!.user.id,
      action: "published",
      resource: "post",
      resourceId: post.id,
      details: post.title,
    });
  }

  return NextResponse.json({ success: true, post: serializePost(post) });
}

// ─── DELETE /api/posts/:id ─────────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const { id } = await params;

  const existing = await prisma.post.findUnique({ where: { id, isDeleted: false } });
  if (!existing) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  const role = (session!.user as { role?: string }).role;
  const isOwner = existing.authorId === session!.user.id;

  if (role !== "ADMIN" && !isOwner) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  // Soft-delete to preserve history/relationships rather than hard-deleting.
  await prisma.post.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });

  await logActivity({
    userId: session!.user.id,
    action: "deleted",
    resource: "post",
    resourceId: id,
    details: existing.title,
  });

  return NextResponse.json({ success: true });
}
