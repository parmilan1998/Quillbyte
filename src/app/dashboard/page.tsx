"use client";

import { FileText, Eye, Heart, PenSquare, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { NotificationService } from "@/services/client/notification-service";
import { formatDate, formatNumber, getInitials } from "@/lib/utils";
import { STATUS_COLORS } from "@/constants";
import { authClient } from "@/lib/client";
import { postService } from "@/services/client/post-service";
import { toast } from "sonner";
import Link from "next/link";

export default function UserDashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const { data: postsData } = useQuery({
    queryKey: ["dashboard-posts", user?.id],
    queryFn: () =>
      postService.getPosts({ author: user!.id, status: "all", limit: 5 }),
    enabled: !!user?.id,
  });
  const userPosts = postsData?.data ?? [];
  const { data: notificationData } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => NotificationService.getAll(),
    enabled: !!user?.id,
  });
  const recentNotifications = notificationData?.notifications.slice(0, 5) ?? [];
  const unread = notificationData?.unreadCount ?? 0;

  const totalViews = userPosts.reduce((s, p) => s + p.viewCount, 0);
  const totalLikes = userPosts.reduce((s, p) => s + p.likeCount, 0);

  const handleVerifyEmail = async () => {
    if (!user?.email) return;
    const { error } = await authClient.sendVerificationEmail({
      email: user.email,
    });
    if (error) {
      toast.error(error.message ?? "Failed to send verification email");
    } else {
      toast.success("Verification email sent — check your inbox.");
    }
  };

  const STATS = [
    {
      label: "Published Posts",
      value: userPosts.filter((p) => p.status === "published").length,
      icon: FileText,
      color: "stat-card-blue",
    },
    {
      label: "Total Views",
      value: formatNumber(totalViews),
      icon: Eye,
      color: "stat-card-violet",
    },
    {
      label: "Total Likes",
      value: formatNumber(totalLikes),
      icon: Heart,
      color: "stat-card-green",
    },
    {
      label: "Notifications",
      value: unread,
      icon: Bell,
      color: "stat-card-orange",
    },
  ];

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback>
              {user ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">
              Welcome back, {user?.name.split(" ")[0]}!
            </h1>
            <p className="text-sm text-muted-foreground capitalize">
              {user?.role?.toLowerCase()} ·{" "}
              {user?.emailVerified ? "✓ Verified" : "Unverified"}
            </p>
          </div>
        </div>
        <Button asChild className=" cursor-pointer">
          <Link href="/dashboard/posts/new">
            <PenSquare className="w-4 h-4 mr-2" />
            Write Post
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`rounded-2xl border p-4 ${color}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {label}
              </p>
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">My Recent Posts</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="cursor-pointer"
            >
              <Link href="/dashboard/posts">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {userPosts.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No posts yet</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 cursor-pointer"
                  asChild
                >
                  <Link href="/dashboard/posts/new">Write your first post</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm font-medium hover:text-primary transition-colors line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          className={`text-[10px] px-1.5 border capitalize ${STATUS_COLORS[post.status]}`}
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
            )}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Notifications</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className=" cursor-pointer"
            >
              <Link href="/dashboard/notifications">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {recentNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-5 py-3 hover:bg-muted/30 transition-colors ${!n.isRead ? "bg-primary/3" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    {n.actor ? (
                      <Avatar size="sm">
                        <AvatarImage src={n.actor.avatar} />
                        <AvatarFallback>
                          {getInitials(n.actor.name)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <Bell className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {n.message}
                      </p>
                    </div>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile completion */}
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-sm">Profile Completion</p>
              <p className="text-xs text-muted-foreground">
                Complete your profile to get more followers
              </p>
            </div>
            <span className="text-sm font-bold text-primary">
              {user?.emailVerified ? 80 : 60}%
            </span>
          </div>
          <Progress value={user?.emailVerified ? 80 : 60} className="h-2" />
          <div className="flex gap-3 mt-3">
            {!user?.image && (
              <Button
                size="sm"
                variant="outline"
                asChild
                className=" cursor-pointer"
              >
                <Link href="/dashboard/settings">Add avatar</Link>
              </Button>
            )}
            {!user?.emailVerified && (
              <Button
                size="sm"
                variant="outline"
                className=" cursor-pointer"
                onClick={handleVerifyEmail}
              >
                Verify email
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
