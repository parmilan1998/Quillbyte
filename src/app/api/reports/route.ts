import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth";
import { requireSession, requireRole } from "@/lib/api-auth";

const TARGET_TYPES = ["POST", "COMMENT", "USER"] as const;
const REASONS = [
  "SPAM",
  "HARASSMENT",
  "MISINFORMATION",
  "COPYRIGHT",
  "INAPPROPRIATE",
  "OTHER",
] as const;

const createReportSchema = z.object({
  targetType: z.enum(TARGET_TYPES),
  targetId: z.string().min(1),
  reason: z.enum(REASONS),
  details: z.string().max(500).optional(),
});

// POST /api/reports — any signed-in user can file a report against a
// post, comment, or user. Deliberately does not verify the target exists
// beyond a basic lookup per type — a report against something already
// deleted is still meaningful context for moderators (e.g. "this user
// posted something bad and then deleted it").
export async function POST(request: NextRequest) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const json = await request.json();
  const parsed = createReportSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { targetType, targetId, reason, details } = parsed.data;

  if (targetType === "USER" && targetId === session!.user.id) {
    return NextResponse.json(
      { message: "You can't report yourself" },
      { status: 400 },
    );
  }

  const report = await prisma.report.create({
    data: {
      targetType,
      targetId,
      reason,
      details,
      reporterId: session!.user.id,
    },
  });

  return NextResponse.json({ success: true, report }, { status: 201 });
}

// GET /api/reports — admin-only, the moderation queue.
export async function GET(request: NextRequest) {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const targetType = searchParams.get("targetType");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Number(searchParams.get("pageSize") ?? "50"));

  const where = {
    ...(status && status !== "all"
      ? { status: status.toUpperCase() as "PENDING" | "RESOLVED" | "DISMISSED" }
      : {}),
    ...(targetType && targetType !== "all"
      ? { targetType: targetType.toUpperCase() as (typeof TARGET_TYPES)[number] }
      : {}),
  };

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        reporter: { select: { id: true, name: true, image: true } },
        reviewedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.report.count({ where }),
  ]);

  // Resolve target display info per type — best-effort, since the target
  // may have been deleted since the report was filed (see the POST note
  // above for why that's still a valid, meaningful report).
  const postIds = reports.filter((r) => r.targetType === "POST").map((r) => r.targetId);
  const commentIds = reports
    .filter((r) => r.targetType === "COMMENT")
    .map((r) => r.targetId);
  const userIds = reports.filter((r) => r.targetType === "USER").map((r) => r.targetId);

  const [posts, comments, users] = await Promise.all([
    postIds.length
      ? prisma.post.findMany({
          where: { id: { in: postIds } },
          select: { id: true, title: true, slug: true },
        })
      : [],
    commentIds.length
      ? prisma.comment.findMany({
          where: { id: { in: commentIds } },
          select: { id: true, content: true },
        })
      : [],
    userIds.length
      ? prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true },
        })
      : [],
  ]);

  const postMap = new Map(posts.map((p) => [p.id, p]));
  const commentMap = new Map(comments.map((c) => [c.id, c]));
  const userMap = new Map(users.map((u) => [u.id, u]));

  const target = (r: (typeof reports)[number]) => {
    if (r.targetType === "POST") return postMap.get(r.targetId) ?? null;
    if (r.targetType === "COMMENT") return commentMap.get(r.targetId) ?? null;
    return userMap.get(r.targetId) ?? null;
  };

  return NextResponse.json({
    reports: reports.map((r) => ({ ...r, target: target(r) })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
