import { apiClient } from "@/lib/api/apiClient";
import type { Notification, User } from "@/types";

interface RawActor {
  id: string;
  name: string;
  image: string | null;
}
interface RawNotification {
  id: string;
  type: "FOLLOW" | "POST_LIKE" | "POST_COMMENT" | "COMMENT_REPLY" | "COMMENT_LIKE";
  entityId: string | null;
  entityType: string | null;
  message: string;
  read: boolean;
  createdAt: string;
  actor: RawActor | null;
}

const TYPE_TO_UI: Record<RawNotification["type"], Notification["type"]> = {
  FOLLOW: "follow",
  POST_LIKE: "like",
  POST_COMMENT: "comment",
  COMMENT_REPLY: "comment",
  COMMENT_LIKE: "like",
};

const TITLE_BY_TYPE: Record<Notification["type"], string> = {
  follow: "New follower",
  like: "New like",
  comment: "New comment",
  mention: "Mention",
  system: "Notification",
  publish: "Post published",
};

function linkFor(n: RawNotification): string | undefined {
  if (n.entityType === "post" && n.entityId) return `/blog/${n.entityId}`;
  if (n.entityType === "user" && n.entityId) return `/authors/${n.entityId}`;
  return undefined;
}

function adaptActor(actor: RawActor | null): User | undefined {
  if (!actor) return undefined;
  return {
    id: actor.id,
    name: actor.name,
    email: "",
    avatar: actor.image ?? undefined,
    role: "author",
    status: "active",
    postCount: 0,
    followerCount: 0,
    followingCount: 0,
    isVerified: false,
    createdAt: "",
    updatedAt: "",
  };
}

function adaptNotification(raw: RawNotification): Notification {
  const type = TYPE_TO_UI[raw.type];
  return {
    id: raw.id,
    type,
    title: TITLE_BY_TYPE[type],
    message: raw.message,
    isRead: raw.read,
    link: linkFor(raw),
    actor: adaptActor(raw.actor),
    createdAt: raw.createdAt,
  };
}

export const NotificationService = {
  async getAll(): Promise<{ notifications: Notification[]; unreadCount: number }> {
    const res = await apiClient.get("/api/notifications", {
      params: { pageSize: 30 },
    });
    return {
      notifications: (res.data.notifications as RawNotification[]).map(
        adaptNotification,
      ),
      unreadCount: res.data.unreadCount,
    };
  },

  async markRead(id: string): Promise<void> {
    await apiClient.patch(`/api/notifications/${id}/read`);
  },

  async markAllRead(): Promise<void> {
    await apiClient.patch("/api/notifications/read-all");
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/api/notifications/${id}`);
  },
};
