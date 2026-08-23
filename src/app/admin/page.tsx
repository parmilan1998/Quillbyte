"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText, Eye, Mail, ArrowUpRight, Users } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/cards";
import { analyticsService } from "../../services/client/analytics-service";
import { postService } from "@/services/client/post-service";
import { AuthorService } from "@/services/client/author-service";
import { formatNumber, formatDate, getInitials } from "@/lib/utils";
import { MOCK_TRAFFIC_SOURCES } from "@/mock/data";
import { STATUS_COLORS, ROLE_COLORS } from "@/constants";
import Link from "next/link";

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export default function AdminDashboardPage() {
  const { data, isLoading: summaryLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => analyticsService.getAll(),
  });
  const summary = data?.summary;
  const chartData = data?.dailyData;
  const chartLoading = summaryLoading;

  const { data: recentPostsData } = useQuery({
    queryKey: ["posts", "recent"],
    queryFn: () => postService.getPosts({ status: "all", limit: 5 }),
  });
  const recentPosts = recentPostsData?.data ?? [];

  const { data: recentUsers = [] } = useQuery({
    queryKey: ["authors", "recent"],
    queryFn: () => AuthorService.getAll(),
  });

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here's what's happening.
          </p>
        </div>
        <Button asChild size="sm" className=" cursor-pointer">
          <Link href="/admin/posts/new">
            <FileText className="w-4 h-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Stats */}
      {summaryLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
          <StatCard
            title="Total Views"
            value={summary.totalViews}
            change={summary.viewsGrowth}
            icon={<Eye className="w-5 h-5 text-primary" />}
            colorClass="stat-card-blue"
          />
          <StatCard
            title="Total Posts"
            value={summary.totalPosts}
            change={summary.postsGrowth}
            icon={<FileText className="w-5 h-5 text-violet" />}
            colorClass="stat-card-violet"
          />
          <StatCard
            title="Users"
            value={summary.totalUsers}
            change={summary.usersGrowth}
            icon={<Users className="w-5 h-5 text-success" />}
            colorClass="stat-card-green"
          />
          <StatCard
            title="Subscribers"
            value={summary.totalSubscribers}
            change={12.5}
            icon={<Mail className="w-5 h-5 text-warning" />}
            colorClass="stat-card-orange"
          />
        </div>
      ) : null}

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Area Chart */}
        <Card className="xl:col-span-2 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Traffic Overview</CardTitle>
            <CardDescription>
              Views and visitors over the past 12 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="gradVisitors"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    name="Views"
                    stroke="var(--chart-1)"
                    fill="url(#gradViews)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="Visitors"
                    stroke="var(--chart-2)"
                    fill="url(#gradVisitors)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={MOCK_TRAFFIC_SOURCES}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="visits"
                  nameKey="source"
                  paddingAngle={2}
                >
                  {MOCK_TRAFFIC_SOURCES.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    fontSize: 11,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {MOCK_TRAFFIC_SOURCES.slice(0, 4).map((s, i) => (
                <div
                  key={s.source}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[i] }}
                    />
                    <span className="text-muted-foreground">{s.source}</span>
                  </span>
                  <span className="font-semibold">{s.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Recent Posts</CardTitle>
              <CardDescription>Latest articles</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className=" cursor-pointer"
            >
              <Link href="/admin/posts">
                View all <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted overflow-hidden shrink-0">
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-sm font-medium hover:text-primary transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        className={`text-[10px] px-1.5 border ${STATUS_COLORS[post.status]}`}
                      >
                        {post.status}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(post.createdAt, "MMM d")}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold">
                      {formatNumber(post.viewCount)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Recent Users</CardTitle>
              <CardDescription>Newest registrations</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className=" cursor-pointer"
            >
              <Link href="/admin/users">
                View all <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
                >
                  <Avatar size="sm">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      className={`text-[10px] px-1.5 border capitalize ${ROLE_COLORS[user.role]}`}
                    >
                      {user.role}
                    </Badge>
                    <Badge
                      className={`text-[10px] px-1.5 border ${STATUS_COLORS[user.status]}`}
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar chart */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Monthly Engagement</CardTitle>
          <CardDescription>
            Comments, likes, and new users per month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  fontSize: 12,
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Bar
                dataKey="comments"
                name="Comments"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="likes"
                name="Likes"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="newUsers"
                name="New Users"
                fill="var(--chart-3)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
