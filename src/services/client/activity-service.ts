import { apiClient } from "@/lib/api/apiClient";
import type { ActivityLog, User } from "@/types";

interface RawUser {
  id: string;
  name: string;
  image: string | null;
}
interface RawLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  details: string | null;
  createdAt: string;
  user: RawUser;
}

function adaptUser(u: RawUser): User {
  return {
    id: u.id,
    name: u.name,
    email: "",
    avatar: u.image ?? undefined,
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

function adaptLog(raw: RawLog): ActivityLog {
  return {
    id: raw.id,
    user: adaptUser(raw.user),
    action: raw.action,
    resource: raw.resource,
    resourceId: raw.resourceId ?? undefined,
    details: raw.details ?? undefined,
    createdAt: raw.createdAt,
  };
}

// Covers admin-relevant moderation/account events only — see the note in
// prisma/schema.prisma. No IP/user-agent (not captured — see the same
// note for why) and no login events (would need a better-auth hook, not
// an app-level call site).
export const activityService = {
  async getLogs(params: {
    search?: string;
    action?: string;
  } = {}): Promise<ActivityLog[]> {
    const res = await apiClient.get("/api/admin/activity", {
      params: {
        search: params.search,
        action: params.action && params.action !== "all" ? params.action : undefined,
        pageSize: 100,
      },
    });
    return (res.data.logs as RawLog[]).map(adaptLog);
  },
};
