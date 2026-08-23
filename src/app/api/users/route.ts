import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";

// GET /api/users — public, read-only list of users for display purposes
// (featured-author sections, the admin author picker, etc). Deliberately a
// safe, minimal DTO: no email, no role/status beyond what's needed to
// distinguish authors, nothing from Session/Account. Only counts published
// posts, so a user's drafts don't leak through here.
//
// NOTE: this is intentionally separate from any future admin user-management
// endpoint (search/filter/suspend/ban etc. — see AUDIT.md). This route only
// supports display use cases and should not be used as the backend for an
// admin users table.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const limit = Math.min(50, Number(searchParams.get("limit") ?? "50"));

  const users = await prisma.user.findMany({
    where: search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : undefined,
    select: {
      id: true,
      name: true,
      image: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          posts: { where: { status: "PUBLISHED" } },
          followers: true,
        },
      },
    },
    take: limit,
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      image: u.image,
      role: u.role,
      createdAt: u.createdAt,
      postCount: u._count.posts,
      followerCount: u._count.followers,
    })),
  });
}
