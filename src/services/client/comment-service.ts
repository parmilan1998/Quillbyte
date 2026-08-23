import { apiClient } from "@/lib/api/apiClient";
import type {
  Comment,
  ApiResponse,
  User,
  PaginatedResponse,
  QueryParams,
} from "@/types";

interface RawAuthor {
  id: string;
  name: string;
  image: string | null;
}
interface RawComment {
  id: string;
  postId: string;
  content: string;
  status: string;
  parentId: string | null;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  user: RawAuthor;
  replies?: RawComment[];
  post?: { id: string; title: string; slug: string };
}

const STATUS_TO_UI: Record<string, Comment["status"]> = {
  VISIBLE: "approved",
  PENDING: "pending",
  HIDDEN: "rejected",
  REMOVED: "spam",
};
const STATUS_TO_API: Record<Comment["status"], string> = {
  approved: "VISIBLE",
  pending: "PENDING",
  rejected: "HIDDEN",
  spam: "REMOVED",
};

function adaptAuthor(author: RawAuthor): User {
  return {
    id: author.id,
    name: author.name,
    email: "",
    avatar: author.image ?? undefined,
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

function adaptComment(raw: RawComment): Comment {
  return {
    id: raw.id,
    postId: raw.postId,
    postTitle: raw.post?.title,
    postSlug: raw.post?.slug,
    author: adaptAuthor(raw.user),
    content: raw.content,
    status: STATUS_TO_UI[raw.status] ?? "approved",
    parentId: raw.parentId ?? undefined,
    replies: raw.replies?.map(adaptComment),
    likeCount: raw.likeCount,
    isLiked: raw.isLiked,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

// Reading/creating/liking comments on a post, editing or deleting your own,
// and — for admins — moderating any comment's visibility. All backed by
// real API routes now (see AUDIT.md for what changed and when).
export const commentService = {
  async getPostComments(postId: string): Promise<Comment[]> {
    const res = await apiClient.get(`/api/posts/${postId}/comments`, {
      params: { pageSize: 50 },
    });
    return (res.data.comments as RawComment[]).map(adaptComment);
  },

  async createComment(
    postId: string,
    content: string,
    parentId?: string,
  ): Promise<ApiResponse<Comment>> {
    try {
      const res = await apiClient.post(`/api/posts/${postId}/comments`, {
        content,
        parentId,
      });
      return {
        success: true,
        data: adaptComment(res.data.comment as RawComment),
        message: "Comment posted",
      };
    } catch (err: any) {
      return {
        success: false,
        data: null as unknown as Comment,
        message: err?.response?.data?.message ?? "Failed to post comment",
      };
    }
  },

  async updateComment(id: string, content: string): Promise<ApiResponse<Comment>> {
    try {
      const res = await apiClient.patch(`/api/comments/${id}`, { content });
      return {
        success: true,
        data: adaptComment(res.data.comment as RawComment),
        message: "Comment updated",
      };
    } catch (err: any) {
      return {
        success: false,
        data: null as unknown as Comment,
        message: err?.response?.data?.message ?? "Failed to update comment",
      };
    }
  },

  async deleteComment(id: string): Promise<ApiResponse<null>> {
    try {
      await apiClient.delete(`/api/comments/${id}`);
      return { success: true, data: null, message: "Comment deleted" };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        message: err?.response?.data?.message ?? "Failed to delete comment",
      };
    }
  },

  async likeComment(id: string): Promise<{ liked: boolean; likeCount: number }> {
    const res = await apiClient.post(`/api/comments/${id}/like`);
    return res.data;
  },

  async unlikeComment(id: string): Promise<{ liked: boolean; likeCount: number }> {
    const res = await apiClient.delete(`/api/comments/${id}/like`);
    return res.data;
  },

  // ─── Admin moderation ──────────────────────────────────────────────────
  // Backed by GET /api/comments (admin-only listing) and the `status`
  // half of PATCH /api/comments/:id (see the route for the authorization
  // split between editing content vs. moderating status).
  async getComments(
    params: QueryParams = {},
  ): Promise<PaginatedResponse<Comment>> {
    const res = await apiClient.get("/api/comments", {
      params: {
        status:
          params.status && params.status !== "all"
            ? STATUS_TO_API[params.status as Comment["status"]] ?? params.status
            : undefined,
        search: params.search,
        page: params.page,
        pageSize: params.limit,
      },
    });
    const comments = (res.data.comments as RawComment[]).map(adaptComment);
    const { total, page, pageSize, totalPages } = res.data;
    return {
      data: comments,
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

  // Same endpoint as getComments — a non-admin caller only ever gets their
  // own comments back regardless (see the route), this just names that
  // use case clearly at the call site.
  async getMyComments(): Promise<Comment[]> {
    const res = await commentService.getComments({ limit: 100 });
    return res.data;
  },

  async approveComment(id: string): Promise<ApiResponse<Comment>> {
    try {
      const res = await apiClient.patch(`/api/comments/${id}`, {
        status: "VISIBLE",
      });
      return {
        success: true,
        data: adaptComment(res.data.comment as RawComment),
        message: "Comment approved",
      };
    } catch (err: any) {
      return {
        success: false,
        data: null as unknown as Comment,
        message: err?.response?.data?.message ?? "Failed to approve comment",
      };
    }
  },

  async rejectComment(id: string): Promise<ApiResponse<Comment>> {
    try {
      const res = await apiClient.patch(`/api/comments/${id}`, {
        status: "HIDDEN",
      });
      return {
        success: true,
        data: adaptComment(res.data.comment as RawComment),
        message: "Comment rejected",
      };
    } catch (err: any) {
      return {
        success: false,
        data: null as unknown as Comment,
        message: err?.response?.data?.message ?? "Failed to reject comment",
      };
    }
  },
};
