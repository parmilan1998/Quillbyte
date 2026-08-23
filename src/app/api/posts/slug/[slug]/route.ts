import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth, prisma } from "@/lib/auth";
import { buildPostInclude, serializePost } from "@/lib/post-query";

// GET /api/posts/slug/:slug — public post lookup by slug, used by the
// article page. Same visibility rule as GET /api/posts/:id: non-published
// posts are only visible to their author or an admin.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  const post = await prisma.post.findUnique({
    where: { slug, isDeleted: false },
    include: buildPostInclude(session?.user?.id),
  });

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  if (post.status !== "PUBLISHED") {
    const role = (session?.user as { role?: string } | undefined)?.role;
    const isOwner = session?.user?.id === post.authorId;

    if (!session || (!isOwner && role !== "ADMIN")) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
  }

  return NextResponse.json({ post: serializePost(post) });
}
