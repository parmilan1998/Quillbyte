import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";

// GET /api/newsletter/subscribers — admin-only.
export async function GET(request: NextRequest) {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Number(searchParams.get("pageSize") ?? "50"));

  const where = {
    ...(status && status !== "all"
      ? { status: status.toUpperCase() as "SUBSCRIBED" | "UNSUBSCRIBED" }
      : {}),
    ...(search
      ? { email: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const [subscribers, total, activeCount] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { subscribedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.newsletterSubscriber.count({ where }),
    prisma.newsletterSubscriber.count({ where: { status: "SUBSCRIBED" } }),
  ]);

  return NextResponse.json({
    subscribers,
    total,
    activeCount,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
