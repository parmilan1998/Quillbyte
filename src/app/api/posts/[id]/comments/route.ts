import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth, prisma } from "@/lib/auth";
import { requireSession } from "@/lib/api-auth";
import { createNotification } from "@/lib/notifications";

const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  parentId: z.string().optional().nullable(),
});

const authorSelect = { id: true, name: true, image: true } as const;

function withLikeState(
  comment: {
    likes: { userId: string }[];
    _count: { likes: number };
    [key: string]: unknown;
  },
  viewerId?: string,
) {
  return {
    ...comment,
    likeCount: comment._count.likes,
    isLiked: viewerId ? comment.likes.some((l) => l.userId === viewerId) : false,
    likes: undefined,
    _count: undefined,
  };
}

// GET /api/posts/:id/comments — top-level comments with one level of
// replies nested underneath (matches the UI's threading — see AUDIT.md
// notes on not over-nesting replies visually).
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: postId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const viewerId = session?.user?.id;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Number(searchParams.get("pageSize") ?? "20"));

  const where = { postId, parentId: null, status: "VISIBLE" as const, isDeleted: false };

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      include: {
        user: { select: authorSelect },
        likes: viewerId ? { where: { userId: viewerId }, select: { userId: true } } : false,
        _count: { select: { likes: true } },
        replies: {
          where: { status: "VISIBLE", isDeleted: false },
          include: {
            user: { select: authorSelect },
            likes: viewerId
              ? { where: { userId: viewerId }, select: { userId: true } }
              : false,
            _count: { select: { likes: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.comment.count({ where }),
  ]);

  return NextResponse.json({
    comments: comments.map((c) => ({
      ...withLikeState(c, viewerId),
      replies: c.replies.map((r) => withLikeState(r, viewerId)),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

// POST /api/posts/:id/comments — create a comment or reply.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const { id: postId } = await params;
  const userId = session!.user.id;

  const post = await prisma.post.findUnique({
    where: { id: postId, isDeleted: false },
    select: { id: true, authorId: true },
  });
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  const json = await request.json();
  const parsed = createCommentSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  const { content, parentId } = parsed.data;

  // Only allow replying to a top-level comment on the same post — keeps
  // threading to one level, matching the UI (see AUDIT.md: "prevent
  // excessively deep reply nesting").
  let parent: { id: string; userId: string; postId: string } | null = null;
  if (parentId) {
    parent = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { id: true, userId: true, postId: true },
    });
    if (!parent || parent.postId !== postId) {
      return NextResponse.json({ message: "Invalid parent comment" }, { status: 400 });
    }
  }

  const comment = await prisma.comment.create({
    data: { content, postId, userId, parentId: parentId ?? null },
    include: {
      user: { select: authorSelect },
    },
  });

  try {
    if (parent) {
      await createNotification({
        recipientId: parent.userId,
        actorId: userId,
        type: "COMMENT_REPLY",
        entityId: comment.id,
        entityType: "comment",
        message: `${session!.user.name} replied to your comment`,
      });
    } else {
      await createNotification({
        recipientId: post.authorId,
        actorId: userId,
        type: "POST_COMMENT",
        entityId: post.id,
        entityType: "post",
        message: `${session!.user.name} commented on your post`,
      });
    }
  } catch {
    // Notification failure shouldn't fail the comment itself.
  }

  return NextResponse.json(
    { success: true, comment: { ...comment, likeCount: 0, isLiked: false, replies: [] } },
    { status: 201 },
  );
}
