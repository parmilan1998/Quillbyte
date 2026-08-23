import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth, prisma } from "@/lib/auth";

// GET /api/users/:id — public, single-user lookup for author profile pages.
// Same safe DTO as GET /api/users (see the note there) — no email, only a
// published-post count, plus real follower/following counts and (when a
// viewer is signed in) whether they follow this user.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const viewerId = session?.user?.id;

  const user = await prisma.user.findUnique({
    where: { id },
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
          following: true,
        },
      },
      followers: viewerId
        ? { where: { followerId: viewerId }, select: { followerId: true } }
        : false,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
      postCount: user._count.posts,
      followerCount: user._count.followers,
      followingCount: user._count.following,
      isFollowing: viewerId ? user.followers.length > 0 : false,
    },
  });
}
