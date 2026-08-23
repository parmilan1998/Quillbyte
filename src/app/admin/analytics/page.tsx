"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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
  TrendingUp,
  Eye,
  Users,
  MessageSquare,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from "@/lib/utils";
import { MOCK_TRAFFIC_SOURCES, MOCK_DEVICE_STATS } from "@/mock/data";
import { analyticsService } from "@/services/client/analytics-service";

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export default function AdminAnalyticsPage() {
  const { data, isLoading: summaryLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => analyticsService.getAll(),
  });
  const summary = data?.summary;
  const chartData = data?.dailyData;
  const topPosts = data?.topPosts;
  const chartLoading = summaryLoading;

  const STAT_CARDS = summary
    ? [
        {
          title: "Total Views",
          value: formatNumber(summary.totalViews),
          change: summary.viewsGrowth,
          icon: Eye,
          color: "text-primary",
        },
        {
          title: "Subscribers",
          value: formatNumber(summary.totalSubscribers),
          change: summary.subscribersGrowth,
          icon: Users,
          color: "text-violet",
        },
        {
          title: "Total Comments",
          value: formatNumber(summary.totalComments),
          change: summary.commentsGrowth,
          icon: MessageSquare,
          color: "text-success",
        },
        {
          title: "Total Likes",
          value: formatNumber(summary.totalLikes),
          change: summary.likesGrowth,
          icon: Heart,
          color: "text-danger",
        },
      ]
    : [];

  const isGrowing = summary
    ? summary.postsGrowth + summary.commentsGrowth + summary.likesGrowth >= 0
    : true;

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            All-time totals · last 30 days vs. the 30 before that
          </p>
        </div>
        <Badge
          className={
            isGrowing
              ? "bg-success/15 text-success border-success/20"
              : "bg-danger/15 text-danger border-danger/20"
          }
        >
          <TrendingUp className="w-3 h-3 mr-1" />
          {isGrowing ? "Growing" : "Declining"}
        </Badge>
      </div>

      {/* Stat cards */}
      {summaryLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
          {STAT_CARDS.map(({ title, value, change, icon: Icon, color }) => (
            <div key={title} className="bg-card border rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {title}
                </p>
                <div
                  className={`w-9 h-9 rounded-xl bg-muted flex items-center justify-center ${color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{value}</p>
              <div className="flex items-center gap-1">
                {change >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-success" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-danger" />
                )}
                <span
                  className={`text-xs font-semibold ${change >= 0 ? "text-success" : "text-danger"}`}
                >
                  {change >= 0 ? "+" : ""}
                  {change}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last month
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main chart */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Traffic Overview</CardTitle>
          <CardDescription>
            Monthly views, visitors, and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="views" className="flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="views">Views & Visitors</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="users">New Users</TabsTrigger>
            </TabsList>

            <TabsContent value="views">
              <p className="text-xs text-muted-foreground mb-3">
                Per-day view history isn't tracked yet — only a running
                total (shown above). This chart will fill in once view
                events are logged individually rather than just counted.
              </p>
              {chartLoading ? (
                <Skeleton className="h-72 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--chart-1)"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--chart-1)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="gVisitors"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--chart-2)"
                          stopOpacity={0.25}
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
                      fill="url(#gViews)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      name="Visitors"
                      stroke="var(--chart-2)"
                      fill="url(#gVisitors)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </TabsContent>

            <TabsContent value="engagement">
              {chartLoading ? (
                <Skeleton className="h-72 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
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
                  </BarChart>
                </ResponsiveContainer>
              )}
            </TabsContent>

            <TabsContent value="users">
              {chartLoading ? (
                <Skeleton className="h-72 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData}>
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
                    <Line
                      type="monotone"
                      dataKey="newUsers"
                      name="New Users"
                      stroke="var(--chart-3)"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Traffic Sources</CardTitle>
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
            <div className="space-y-2 mt-3">
              {MOCK_TRAFFIC_SOURCES.map((s, i) => (
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
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {formatNumber(s.visits)}
                    </span>
                    <span className="font-semibold">{s.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Devices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_DEVICE_STATS.map((d, i) => (
              <div key={d.device}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{d.device}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      {formatNumber(d.sessions)}
                    </span>
                    <span className="font-semibold">{d.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${d.percentage}%`,
                      backgroundColor: PIE_COLORS[i],
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Top Posts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {(topPosts ?? []).slice(0, 5).map((post, idx) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <span className="text-xl font-bold text-muted-foreground/25 w-6 shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-1">
                      {post.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {formatNumber(post.views)} views · {post.likes} likes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
