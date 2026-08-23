"use client";

import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Check,
  Trash2,
  MessageSquare,
  Heart,
  UserCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { NotificationService } from "@/services/client/notification-service";
import { formatRelativeDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

const TYPE_ICONS = {
  comment: MessageSquare,
  like: Heart,
  follow: UserCheck,
  mention: Zap,
  system: Bell,
  publish: Zap,
};

const TYPE_COLORS = {
  comment: "bg-primary/15 text-primary",
  like: "bg-danger/15 text-danger",
  follow: "bg-violet/15 text-violet",
  mention: "bg-sky/15 text-sky",
  system: "bg-muted text-muted-foreground",
  publish: "bg-success/15 text-success",
};

export default function UserNotificationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => NotificationService.getAll(),
  });
  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["notifications"] });

  const handleMarkAllRead = async () => {
    await NotificationService.markAllRead();
    invalidate();
  };

  const handleClick = async (id: string, isRead: boolean, link?: string) => {
    if (!isRead) {
      await NotificationService.markRead(id);
      invalidate();
    }
    if (link) router.push(link);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await NotificationService.remove(id);
    invalidate();
  };

  return (
    <div className="space-y-5 page-enter max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${unreadCount} unread notifications`}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className=" cursor-pointer"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
        )}
      </div>

      {!isLoading && notifications.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="Likes, comments, replies, and follows will show up here."
          icon={<Bell className="w-8 h-8 text-muted-foreground/40" />}
        />
      ) : (
        <div className="bg-card border rounded-2xl overflow-hidden divide-y divide-border/60">
          {notifications.map((n, idx) => {
            const Icon = TYPE_ICONS[n.type] ?? Bell;
            const colorClass = TYPE_COLORS[n.type] ?? TYPE_COLORS.system;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => handleClick(n.id, n.isRead, n.link)}
                className={`flex items-start gap-4 p-4 hover:bg-muted/20 transition-colors cursor-pointer ${!n.isRead ? "bg-primary/3" : ""}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{n.title}</p>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {n.message}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">
                    {formatRelativeDate(n.createdAt)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleDelete(e, n.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-danger shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
