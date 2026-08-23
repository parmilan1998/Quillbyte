import type { User, PaginatedResponse, QueryParams, ApiResponse } from "@/types";
import { apiClient } from "@/lib/api/apiClient";

interface RawUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "BANNED";
  emailVerified: boolean;
  createdAt: string;
  postCount: number;
  followerCount: number;
}

const STATUS_TO_UI: Record<RawUser["status"], User["status"]> = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  BANNED: "banned",
};

function adaptUser(raw: RawUser): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatar: raw.image ?? undefined,
    role: raw.role === "ADMIN" ? "admin" : "author",
    status: STATUS_TO_UI[raw.status],
    postCount: raw.postCount,
    followerCount: raw.followerCount,
    followingCount: 0,
    isVerified: raw.emailVerified,
    createdAt: raw.createdAt,
    updatedAt: raw.createdAt,
  };
}

// This is the admin user-MANAGEMENT service (search/filter/role/status),
// backed by the admin-only /api/admin/users routes — distinct from
// author-service.ts, which covers read-only public display use cases.
// See the note in src/app/api/users/route.ts.
export const userService = {
  async getUsers(params: QueryParams = {}): Promise<PaginatedResponse<User>> {
    const res = await apiClient.get("/api/admin/users", {
      params: {
        search: params.search,
        status:
          params.status && params.status !== "all"
            ? params.status.toUpperCase()
            : undefined,
        page: params.page,
        pageSize: params.limit,
      },
    });
    const { total, page, pageSize, totalPages } = res.data;
    return {
      data: (res.data.users as RawUser[]).map(adaptUser),
      meta: {
        total,
        page,
        limit: pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  },

  async setStatus(
    id: string,
    status: "ACTIVE" | "SUSPENDED" | "BANNED",
  ): Promise<ApiResponse<null>> {
    try {
      await apiClient.patch(`/api/admin/users/${id}`, { status });
      return { success: true, data: null, message: "Status updated" };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        message: err?.response?.data?.message ?? "Failed to update status",
      };
    }
  },

  async setRole(
    id: string,
    role: "USER" | "ADMIN",
  ): Promise<ApiResponse<null>> {
    try {
      await apiClient.patch(`/api/admin/users/${id}`, { role });
      return { success: true, data: null, message: "Role updated" };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        message: err?.response?.data?.message ?? "Failed to update role",
      };
    }
  },

  // Anonymizes the account rather than hard-deleting it — see the note on
  // DELETE /api/admin/users/:id for why. Their posts/comments stay intact
  // and attributed to "Deleted User" instead of vanishing along with them.
  async deleteUser(id: string): Promise<ApiResponse<null>> {
    try {
      await apiClient.delete(`/api/admin/users/${id}`);
      return { success: true, data: null, message: "Account deleted" };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        message: err?.response?.data?.message ?? "Failed to delete account",
      };
    }
  },
};
