import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";

// GET /api/admin/analytics — admin-only. Computes real numbers from data
// that actually exists (posts, comments, likes, users, subscribers), with
// one honest limitation worth reading before trusting this at a glance:
//
// Post views are a running counter (Post.viewCount, incremented by
// POST /api/posts/:id/view — see AUDIT.md), not a per-event log with
// timestamps. That means "total views" is real, but a day-by-day views
// trend and any views-based growth % genuinely can't be reconstructed —
// there's no history to compute it from. Rather than fabricate a curve,
// this endpoint returns 0 for those specific fields and says so in the
// admin UI, instead of quietly making up a plausible-looking number.
export async function GET() {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const now = new Date();
  const periodStart = new Date(now);
  periodStart.setDate(periodStart.getDate() - 30);
  const prevPeriodStart = new Date(periodStart);
  prevPeriodStart.setDate(prevPeriodStart.getDate() - 30);

  const growthOf = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 1000) / 10;
  };

  const [
    totalViewsAgg,
    totalPosts,
    totalUsers,
    totalComments,
    totalSubscribers,
    totalLikes,
    postsThisPeriod,
    postsPrevPeriod,
    usersThisPeriod,
    usersPrevPeriod,
    commentsThisPeriod,
    commentsPrevPeriod,
    likesThisPeriod,
    likesPrevPeriod,
    subscribersThisPeriod,
    subscribersPrevPeriod,
    recentComments,
    recentLikes,
    recentUsers,
    topPostsRaw,
  ] = await Promise.all([
    prisma.post.aggregate({ _sum: { viewCount: true }, where: { isDeleted: false } }),
    prisma.post.count({ where: { isDeleted: false, status: "PUBLISHED" } }),
    prisma.user.count(),
    prisma.comment.count({ where: { isDeleted: false } }),
    prisma.newsletterSubscriber.count({ where: { status: "SUBSCRIBED" } }),
    prisma.postLike.count(),
    prisma.post.count({ where: { createdAt: { gte: periodStart } } }),
    prisma.post.count({
      where: { createdAt: { gte: prevPeriodStart, lt: periodStart } },
    }),
    prisma.user.count({ where: { createdAt: { gte: periodStart } } }),
    prisma.user.count({
      where: { createdAt: { gte: prevPeriodStart, lt: periodStart } },
    }),
    prisma.comment.count({ where: { createdAt: { gte: periodStart } } }),
    prisma.comment.count({
      where: { createdAt: { gte: prevPeriodStart, lt: periodStart } },
    }),
    prisma.postLike.count({ where: { createdAt: { gte: periodStart } } }),
    prisma.postLike.count({
      where: { createdAt: { gte: prevPeriodStart, lt: periodStart } },
    }),
    prisma.newsletterSubscriber.count({
      where: { status: "SUBSCRIBED", subscribedAt: { gte: periodStart } },
    }),
    prisma.newsletterSubscriber.count({
      where: {
        status: "SUBSCRIBED",
        subscribedAt: { gte: prevPeriodStart, lt: periodStart },
      },
    }),
    // Last 14 days of raw timestamps — grouped in JS below into daily
    // buckets, since SQLite/Postgres date-trunc grouping via Prisma's
    // query builder alone is awkward across the two; this is small enough
    // data (a few weeks) that in-memory bucketing is simpler and fine.
    prisma.comment.findMany({
      where: { createdAt: { gte: periodStart } },
      select: { createdAt: true },
    }),
    prisma.postLike.findMany({
      where: { createdAt: { gte: periodStart } },
      select: { createdAt: true },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: periodStart } },
      select: { createdAt: true },
    }),
    prisma.post.findMany({
      where: { isDeleted: false, status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImageUrl: true,
        viewCount: true,
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { viewCount: "desc" },
      take: 10,
    }),
  ]);

  const dayKey = (d: Date) => d.toISOString().slice(0, 10);
  const days: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(dayKey(d));
  }
  const bucket = (rows: { createdAt: Date }[]) => {
    const counts: Record<string, number> = {};
    for (const row of rows) {
      const key = dayKey(new Date(row.createdAt));
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  };
  const commentCounts = bucket(recentComments);
  const likeCounts = bucket(recentLikes);
  const userCounts = bucket(recentUsers);

  const dailyData = days.map((date) => ({
    date,
    // Not derivable — see the comment at the top of this file.
    views: 0,
    visitors: 0,
    comments: commentCounts[date] ?? 0,
    likes: likeCounts[date] ?? 0,
    newUsers: userCounts[date] ?? 0,
  }));

  return NextResponse.json({
    summary: {
      totalViews: totalViewsAgg._sum.viewCount ?? 0,
      totalPosts,
      totalUsers,
      totalComments,
      totalSubscribers,
      totalLikes,
      viewsGrowth: 0, // not derivable — see file comment
      postsGrowth: growthOf(postsThisPeriod, postsPrevPeriod),
      usersGrowth: growthOf(usersThisPeriod, usersPrevPeriod),
      commentsGrowth: growthOf(commentsThisPeriod, commentsPrevPeriod),
      likesGrowth: growthOf(likesThisPeriod, likesPrevPeriod),
      subscribersGrowth: growthOf(subscribersThisPeriod, subscribersPrevPeriod),
    },
    dailyData,
    topPosts: topPostsRaw.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      featuredImage: p.featuredImageUrl,
      views: p.viewCount,
      likes: p._count.likes,
      comments: p._count.comments,
    })),
  });
}
