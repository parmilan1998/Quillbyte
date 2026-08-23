import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireSession } from "@/lib/api-auth";
import { createNotification } from "@/lib/notifications";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const { id: commentId } = await params;
  const userId = session!.user.id;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId, isDeleted: false },
    select: { id: true, userId: true },
  });
  if (!comment) {
    return NextResponse.json({ message: "Comment not found" }, { status: 404 });
  }

  await prisma.commentLike.upsert({
    where: { commentId_userId: { commentId, userId } },
    create: { commentId, userId },
    update: {},
  });

  try {
    await createNotification({
      recipientId: comment.userId,
      actorId: userId,
      type: "COMMENT_LIKE",
      entityId: comment.id,
      entityType: "comment",
      message: `${session!.user.name} liked your comment`,
    });
  } catch {
    // Notification failure shouldn't fail the like itself.
  }

  const likeCount = await prisma.commentLike.count({ where: { commentId } });
  return NextResponse.json({ liked: true, likeCount });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const { id: commentId } = await params;
  const userId = session!.user.id;

  await prisma.commentLike.deleteMany({ where: { commentId, userId } });

  const likeCount = await prisma.commentLike.count({ where: { commentId } });
  return NextResponse.json({ liked: false, likeCount });
}
