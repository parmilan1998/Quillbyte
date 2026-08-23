import { NextRequest, NextResponse } from "next/server";
import { auth, prisma } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const viewSchema = z.object({
  progress: z.number().min(0).max(100).optional(),
});

// POST /api/posts/:id/view — increments the post's view count, and (for a
// signed-in caller) upserts their ReadingHistory entry with progress and a
// fresh lastViewedAt. Anonymous views still count toward viewCount but
// obviously can't be tied to a reading-history entry.
//
// Dedup note: this is intentionally simple (every call increments) — the
// client is responsible for calling it once per page view (see the blog
// detail page's mount effect, guarded against React double-invoke/rapid
// remounts), not on every scroll/progress update. A more robust
// per-IP/per-session dedup window is a reasonable future improvement (see
// AUDIT.md item on avoiding "excessive" view counting) but isn't in place
// yet — don't assume this number is bot/refresh-proof.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: postId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  const post = await prisma.post.findUnique({
    where: { id: postId, isDeleted: false },
    select: { id: true },
  });
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  const json = await request.json().catch(() => ({}));
  const parsed = viewSchema.safeParse(json);
  const progress = parsed.success ? parsed.data.progress : undefined;

  await Promise.all([
    prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
    }),
    session?.user?.id
      ? prisma.readingHistory.upsert({
          where: {
            userId_postId: { userId: session.user.id, postId },
          },
          create: {
            userId: session.user.id,
            postId,
            progress: progress ?? 0,
          },
          update: {
            progress: progress ?? undefined,
            lastViewedAt: new Date(),
          },
        })
      : Promise.resolve(),
  ]);

  return NextResponse.json({ success: true });
}
