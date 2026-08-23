"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Bell,
  User,
  Settings,
  LogOut,
  Heart,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { getInitials, formatRelativeDate } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationService } from "@/services/client/notification-service";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { authClient } from "@/lib/client";
import { PageLoader, startPageLoading } from "@/components/ui/page-loader";
import Link from "next/link";

type DashboardLayoutProps = {
  children: ReactNode;
  variant?: "user" | "admin";
  requiredRole?: "admin";
};

export default function DashboardLayout({
  children,
  requiredRole,
}: DashboardLayoutProps) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isAuthorized = !requiredRole || role === "ADMIN";

  // ── All hooks must be called unconditionally before any early return ──
  const queryClient = useQueryClient();
  const { data: notificationData } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => NotificationService.getAll(),
    // Only fetch when there is an authenticated session to avoid
    // unauthenticated API calls while the redirect is in flight.
    enabled: !!session,
    // Lightweight polling so the badge doesn't go stale for the length of
    // a whole session — no WebSocket layer exists yet (see AUDIT.md).
    refetchInterval: 30_000,
  });
  const notifications = notificationData?.notifications ?? [];
  const unreadCount = notificationData?.unreadCount ?? 0;

  // NOTE: this is a client-side UX guard only (avoids flashing admin
  // content before redirecting). The authoritative check lives server-side
  // in src/app/admin/layout.tsx, which runs before this component ever
  // mounts for /admin routes — don't rely on this check alone.
  useEffect(() => {
    if (isPending) return;
    if (!session) {
      startPageLoading();
      router.replace("/auth/sign-in");
      router.refresh();
      return;
    }
    if (!isAuthorized) {
      startPageLoading();
      router.replace("/dashboard");
    }
  }, [session, isPending, isAuthorized, router]);

  const logout = async () => {
    await authClient.signOut();
    startPageLoading();
    router.replace("/auth/sign-in");
    router.refresh();
  };

  const markAllRead = async () => {
    await NotificationService.markAllRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markRead = async (id: string) => {
    await NotificationService.markRead(id);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const notificationIcon = (type: string) => {
    if (type === "follow") return <UserPlus className="w-3.5 h-3.5" />;
    if (type === "comment") return <MessageSquare className="w-3.5 h-3.5" />;
    return <Heart className="w-3.5 h-3.5" />;
  };

  if (isPending) {
    return <PageLoader />;
  }

  if (!session || !isAuthorized) {
    return null;
  }

  const user = session.user;

  return (
    <SidebarProvider>
      <DashboardSidebar />

      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-14 items-center border-b bg-background px-4">
          <SidebarTrigger />

          <Separator orientation="vertical" className="mx-4 h-6" />

          <div className="flex-1" />

          <div className="ml-auto flex items-center gap-2">
            <ModeToggle />

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative cursor-pointer"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-2 py-2">
                  <p className="text-sm font-semibold">Notifications</p>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-primary cursor-pointer hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                    No notifications yet
                  </p>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.slice(0, 8).map((n) => (
                      <button
                        key={n.id}
                        onClick={() => !n.isRead && markRead(n.id)}
                        className={`w-full text-left flex gap-2.5 px-2 py-2.5 rounded-md text-sm cursor-pointer hover:bg-muted/50 transition-colors ${
                          !n.isRead ? "bg-primary/5" : ""
                        }`}
                      >
                        <span className="mt-0.5 text-muted-foreground shrink-0">
                          {notificationIcon(n.type)}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-xs leading-snug">
                            {n.message}
                          </span>
                          <span className="block text-[10px] text-muted-foreground mt-0.5">
                            {formatRelativeDate(n.createdAt)}
                          </span>
                        </span>
                        {!n.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/notifications"
                    className="justify-center text-xs cursor-pointer"
                  >
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {getInitials(user?.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/profile")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/settings")}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
