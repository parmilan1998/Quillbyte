import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/api-auth";
import { prisma } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

// POST /api/posts/:id/like — like a post. Idempotent: liking an
// already-liked post just returns the current state rather than erroring,
// since a double-click race is expected from optimistic UI.
export async function POST(
  _request: NextRequest,
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

  await prisma.postLike.upsert({
    where: { postId_userId: { postId, userId } },
    create: { postId, userId },
    update: {},
  });

  try {
    await createNotification({
      recipientId: post.authorId,
      actorId: userId,
      type: "POST_LIKE",
      entityId: post.id,
      entityType: "post",
      message: `${session!.user.name} liked your post`,
    });
  } catch {
    // Notification failure shouldn't fail the like itself.
  }

  const likeCount = await prisma.postLike.count({ where: { postId } });
  return NextResponse.json({ liked: true, likeCount });
}

// DELETE /api/posts/:id/like — unlike a post. Also idempotent.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const { id: postId } = await params;
  const userId = session!.user.id;

  await prisma.postLike.deleteMany({ where: { postId, userId } });

  const likeCount = await prisma.postLike.count({ where: { postId } });
  return NextResponse.json({ liked: false, likeCount });
}
