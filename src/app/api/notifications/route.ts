import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireSession } from "@/lib/api-auth";

// GET /api/notifications — the signed-in user's own notifications only
// (recipientId is always taken from the session, never from a query param
// — a notification inbox is never someone else's to read).
export async function GET(request: NextRequest) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const recipientId = session!.user.id;
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Number(searchParams.get("pageSize") ?? "20"));

  const [notifications, unreadCount, total] = await Promise.all([
    prisma.notification.findMany({
      where: { recipientId },
      include: { actor: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.notification.count({ where: { recipientId, read: false } }),
    prisma.notification.count({ where: { recipientId } }),
  ]);

  return NextResponse.json({
    notifications,
    unreadCount,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
