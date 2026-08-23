import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";

// GET /api/admin/users — admin-only. Unlike the public /api/users (safe,
// no-email DTO for display purposes), this one exposes email — an admin
// managing accounts legitimately needs it, and this route is gated
// accordingly.
export async function GET(request: NextRequest) {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Number(searchParams.get("pageSize") ?? "50"));

  const where = {
    ...(status && status !== "all"
      ? { status: status.toUpperCase() as "ACTIVE" | "SUSPENDED" | "BANNED" }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            posts: { where: { status: "PUBLISHED" } },
            followers: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    users: users.map((u) => ({
      ...u,
      postCount: u._count.posts,
      followerCount: u._count.followers,
      _count: undefined,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
