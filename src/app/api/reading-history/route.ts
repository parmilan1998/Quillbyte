import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireSession } from "@/lib/api-auth";
import { buildPostInclude, serializePost } from "@/lib/post-query";

// GET /api/reading-history — the signed-in user's history, most recently
// viewed first. Always scoped to the caller, same reasoning as /bookmarks.
export async function GET(request: NextRequest) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const userId = session!.user.id;
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Number(searchParams.get("pageSize") ?? "20"));

  const [entries, total] = await Promise.all([
    prisma.readingHistory.findMany({
      where: { userId, post: { isDeleted: false } },
      include: { post: { include: buildPostInclude(userId) } },
      orderBy: { lastViewedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.readingHistory.count({ where: { userId, post: { isDeleted: false } } }),
  ]);

  return NextResponse.json({
    entries: entries.map((e) => ({
      post: serializePost(e.post),
      progress: e.progress,
      lastViewedAt: e.lastViewedAt,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

// DELETE /api/reading-history — clear all of the caller's history.
export async function DELETE() {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  await prisma.readingHistory.deleteMany({ where: { userId: session!.user.id } });
  return NextResponse.json({ success: true });
}
