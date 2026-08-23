import { apiClient } from "@/lib/api/apiClient";
import type { User } from "@/types";

interface RawUser {
  id: string;
  name: string;
  image: string | null;
  role: string;
  createdAt: string;
  postCount: number;
  followerCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

// Adapts the minimal /api/users DTO into the full User shape the UI
// expects. Profile fields that don't exist in the database yet (bio,
// social links — see AUDIT.md, the User model only has id/name/email/
// role/image/timestamps) default to empty rather than being invented.
// Follower/following counts ARE real now (Follow model + /api/users routes
// both compute them).
function adaptUser(raw: RawUser): User {
  return {
    id: raw.id,
    name: raw.name,
    email: "",
    avatar: raw.image ?? undefined,
    role: raw.role === "ADMIN" ? "admin" : "author",
    status: "active",
    postCount: raw.postCount,
    followerCount: raw.followerCount ?? 0,
    followingCount: raw.followingCount ?? 0,
    isFollowing: raw.isFollowing ?? false,
    isVerified: raw.role === "ADMIN",
    createdAt: raw.createdAt,
    updatedAt: raw.createdAt,
  };
}

// Deliberately separate from user-service.ts (the mock admin user-management
// service) — this only covers read-only display use cases. See the note in
// src/app/api/users/route.ts.
export const AuthorService = {
  async getAll(search?: string): Promise<User[]> {
    const res = await apiClient.get("/api/users", { params: { search } });
    return (res.data.users as RawUser[]).map(adaptUser);
  },

  async getById(id: string): Promise<User | null> {
    try {
      const res = await apiClient.get(`/api/users/${id}`);
      return adaptUser(res.data.user as RawUser);
    } catch {
      return null;
    }
  },

  // Authors = users who have actually published something, ranked by post
  // count. Used for "Featured Authors"-style sections.
  async getFeatured(limit = 4): Promise<User[]> {
    const all = await AuthorService.getAll();
    return all
      .filter((u) => u.postCount > 0)
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, limit);
  },

  async follow(id: string): Promise<{ following: boolean; followerCount: number }> {
    const res = await apiClient.post(`/api/users/${id}/follow`);
    return res.data;
  },

  async unfollow(id: string): Promise<{ following: boolean; followerCount: number }> {
    const res = await apiClient.delete(`/api/users/${id}/follow`);
    return res.data;
  },
};
