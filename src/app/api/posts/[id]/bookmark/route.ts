import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/api-auth";
import { prisma } from "@/lib/auth";

// POST /api/posts/:id/bookmark — idempotent, same pattern as /like.
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
    select: { id: true },
  });
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  await prisma.bookmark.upsert({
    where: { postId_userId: { postId, userId } },
    create: { postId, userId },
    update: {},
  });

  return NextResponse.json({ bookmarked: true });
}

// DELETE /api/posts/:id/bookmark
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const { id: postId } = await params;
  const userId = session!.user.id;

  await prisma.bookmark.deleteMany({ where: { postId, userId } });

  return NextResponse.json({ bookmarked: false });
}
