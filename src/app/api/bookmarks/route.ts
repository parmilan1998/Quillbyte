import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireSession } from "@/lib/api-auth";
import { buildPostInclude, serializePost } from "@/lib/post-query";

// GET /api/bookmarks — the signed-in user's bookmarked posts, always
// scoped to the caller (never a query-param userId — someone's saved
// reading list isn't public).
export async function GET(request: NextRequest) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const userId = session!.user.id;
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Number(searchParams.get("pageSize") ?? "20"));

  const [bookmarks, total] = await Promise.all([
    prisma.bookmark.findMany({
      where: { userId, post: { isDeleted: false } },
      include: { post: { include: buildPostInclude(userId) } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.bookmark.count({ where: { userId, post: { isDeleted: false } } }),
  ]);

  return NextResponse.json({
    posts: bookmarks.map((b) => serializePost(b.post)),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
