import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";

const ACTIONS = ["published", "created", "updated", "deleted"] as const;

// GET /api/admin/activity — admin-only.
export async function GET(request: NextRequest) {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const action = searchParams.get("action");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Number(searchParams.get("pageSize") ?? "50"));

  const where = {
    ...(action && (ACTIONS as readonly string[]).includes(action)
      ? { action }
      : {}),
    ...(search
      ? {
          OR: [
            { resource: { contains: search, mode: "insensitive" as const } },
            { details: { contains: search, mode: "insensitive" as const } },
            { user: { name: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.activityLog.count({ where }),
  ]);

  return NextResponse.json({
    logs,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
