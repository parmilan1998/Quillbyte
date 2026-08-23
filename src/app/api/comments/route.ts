import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireSession } from "@/lib/api-auth";

const COMMENT_STATUSES = ["VISIBLE", "PENDING", "HIDDEN", "REMOVED"] as const;

// GET /api/comments — admins get the full moderation queue across every
// post; a signed-in non-admin only ever gets their own comments (forced
// via `userId`, regardless of what they pass) — this is not a general
// "browse anyone's comments" endpoint.
export async function GET(request: NextRequest) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const role = (session!.user as { role?: string }).role;
  const isAdmin = role === "ADMIN";

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Number(searchParams.get("pageSize") ?? "20"));

  const statusFilter =
    status && (COMMENT_STATUSES as readonly string[]).includes(status)
      ? { status: status as (typeof COMMENT_STATUSES)[number] }
      : {};

  const where = {
    isDeleted: false,
    ...statusFilter,
    ...(isAdmin ? {} : { userId: session!.user.id }),
    ...(search
      ? {
          OR: [
            { content: { contains: search, mode: "insensitive" as const } },
            ...(isAdmin
              ? [{ user: { name: { contains: search, mode: "insensitive" as const } } }]
              : []),
          ],
        }
      : {}),
  };

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        post: { select: { id: true, title: true, slug: true } },
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.comment.count({ where }),
  ]);

  return NextResponse.json({
    comments: comments.map((c) => ({
      ...c,
      likeCount: c._count.likes,
      _count: undefined,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
