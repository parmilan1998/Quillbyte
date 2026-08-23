import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth";
import { requireSession } from "@/lib/api-auth";
import { logActivity } from "@/lib/activity-log";

const COMMENT_STATUSES = ["VISIBLE", "PENDING", "HIDDEN", "REMOVED"] as const;

const updateCommentSchema = z.object({
  content: z.string().min(1).max(2000).optional(),
  status: z.enum(COMMENT_STATUSES).optional(),
});

// PATCH /api/comments/:id — two distinct authorizations on one route:
//   - content: only the comment's own author may edit their words.
//   - status: only an admin may moderate (approve/hide/remove) — never
//     rewrites the content, only its visibility.
// A request must be doing at least one of these, and only the parts it's
// authorized for.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const { id } = await params;
  const existing = await prisma.comment.findUnique({
    where: { id, isDeleted: false },
    select: { id: true, userId: true },
  });
  if (!existing) {
    return NextResponse.json({ message: "Comment not found" }, { status: 404 });
  }

  const json = await request.json();
  const parsed = updateCommentSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  const { content, status } = parsed.data;
  if (content === undefined && status === undefined) {
    return NextResponse.json({ message: "Nothing to update" }, { status: 400 });
  }

  const role = (session!.user as { role?: string }).role;
  const isOwner = existing.userId === session!.user.id;
  const isAdmin = role === "ADMIN";

  if (content !== undefined && !isOwner) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  if (status !== undefined && !isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const comment = await prisma.comment.update({
    where: { id },
    data: {
      ...(content !== undefined ? { content } : {}),
      ...(status !== undefined ? { status } : {}),
    },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  if (status !== undefined && isAdmin) {
    await logActivity({
      userId: session!.user.id,
      action: "updated",
      resource: "comment",
      resourceId: id,
      details: `moderated to ${status}`,
    });
  }

  return NextResponse.json({ success: true, comment });
}

// DELETE /api/comments/:id — own comment, or admin moderation.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const { id } = await params;
  const existing = await prisma.comment.findUnique({
    where: { id, isDeleted: false },
    select: { id: true, userId: true },
  });
  if (!existing) {
    return NextResponse.json({ message: "Comment not found" }, { status: 404 });
  }

  const role = (session!.user as { role?: string }).role;
  if (role !== "ADMIN" && existing.userId !== session!.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await prisma.comment.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });

  if (role === "ADMIN" && existing.userId !== session!.user.id) {
    await logActivity({
      userId: session!.user.id,
      action: "deleted",
      resource: "comment",
      resourceId: id,
      details: "removed by moderation",
    });
  }

  return NextResponse.json({ success: true });
}
