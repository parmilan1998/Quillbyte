import axios from "axios";
import { apiClient } from "@/lib/api/apiClient";
import { API } from "@/lib/api/endpoints";
import type {
  Post,
  Category,
  Tag as TagType,
  User,
  PaginatedResponse,
  QueryParams,
  ApiResponse,
  PostStatus,
} from "@/types";

// ─── status enum mapping — the UI/types use lowercase ("published"), the
// database enum is uppercase ("PUBLISHED"). ─────────────────────────────────

const STATUS_TO_UI: Record<string, PostStatus> = {
  DRAFT: "draft",
  PUBLISHED: "published",
  SCHEDULED: "scheduled",
  ARCHIVED: "archived",
};
const STATUS_TO_API: Record<PostStatus, string> = {
  draft: "DRAFT",
  published: "PUBLISHED",
  scheduled: "SCHEDULED",
  archived: "ARCHIVED",
};

// ─── raw shapes returned by the Prisma-backed API routes ──────────────────

interface RawAuthor {
  id: string;
  name: string;
  image: string | null;
}
interface RawCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}
interface RawTag {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string | null;
  createdAt: string;
}
interface RawPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImageUrl: string | null;
  status: string;
  isFeatured: boolean;
  isTrending: boolean;
  readingTime: number;
  viewCount: number;
  likeCount?: number;
  commentCount?: number;
  bookmarkCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  publishedAt: string | null;
  scheduledAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  author: RawAuthor;
  category: RawCategory | null;
  tags: RawTag[];
}

// ─── adapters: Prisma-shaped API responses → the Post/Category/Tag/User
// shapes the UI expects. Engagement counts (likes/comments/bookmarks) and
// most profile fields aren't backed by the database yet (no Like/Comment/
// Bookmark models — see AUDIT.md), so they default to 0/placeholder rather
// than being invented. ───────────────────────────────────────────────────

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

function adaptCategory(category: RawCategory | null): Category {
  if (!category) {
    return {
      id: "uncategorized",
      name: "Uncategorized",
      slug: "uncategorized",
      color: "#6366f1",
      postCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? undefined,
    color: category.color,
    postCount: 0,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

function adaptTag(tag: RawTag): TagType {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    color: tag.color,
    description: tag.description ?? undefined,
    postCount: 0,
    createdAt: tag.createdAt,
  };
}

function adaptPost(raw: RawPost): Post {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt ?? "",
    content: raw.content,
    featuredImage: raw.featuredImageUrl ?? undefined,
    status: STATUS_TO_UI[raw.status] ?? "draft",
    author: adaptAuthor(raw.author),
    category: adaptCategory(raw.category),
    tags: (raw.tags ?? []).map(adaptTag),
    publishedAt: raw.publishedAt ?? undefined,
    scheduledAt: raw.scheduledAt ?? undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    readingTime: raw.readingTime ?? 0,
    viewCount: raw.viewCount ?? 0,
    likeCount: raw.likeCount ?? 0,
    commentCount: raw.commentCount ?? 0,
    bookmarkCount: raw.bookmarkCount ?? 0,
    isLiked: raw.isLiked ?? false,
    isBookmarked: raw.isBookmarked ?? false,
    isFeatured: raw.isFeatured,
    isTrending: raw.isTrending,
    seoTitle: raw.seoTitle ?? undefined,
    seoDescription: raw.seoDescription ?? undefined,
  };
}

function paginate(res: {
  posts: RawPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}): PaginatedResponse<Post> {
  return {
    data: res.posts.map(adaptPost),
    meta: {
      total: res.total,
      page: res.page,
      limit: res.pageSize,
      totalPages: res.totalPages,
      hasNextPage: res.page < res.totalPages,
      hasPrevPage: res.page > 1,
    },
  };
}

function errorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && typeof err.response?.data?.message === "string") {
    return err.response.data.message;
  }
  return fallback;
}

// ─── outbound payload shape for create/update ──────────────────────────────

export interface PostWritePayload {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  authorId?: string;
  status: PostStatus;
  isFeatured?: boolean;
  isTrending?: boolean;
  scheduledAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  tagIds?: string[];
  featuredImage?: File | null;
}

function toApiPayload(data: Partial<PostWritePayload>) {
  const payload: Record<string, unknown> = { ...data };
  delete payload.featuredImage;
  if (data.status) payload.status = STATUS_TO_API[data.status];
  return payload;
}

// Uploads a featured image via /api/upload (Cloudinary) and returns the
// fields the create/update payload needs. Returns null if there's no file
// to upload.
async function uploadFeaturedImage(
  file: File | null | undefined,
): Promise<{ featuredImageUrl: string; featuredImageId: string } | null> {
  if (!file) return null;
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiClient.post(API.UPLOADS.IMAGE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return { featuredImageUrl: res.data.url, featuredImageId: res.data.publicId };
}

export const postService = {
  async getPosts(params: QueryParams = {}): Promise<PaginatedResponse<Post>> {
    const status =
      params.status && params.status !== "all"
        ? STATUS_TO_API[params.status as PostStatus] ?? params.status
        : undefined;

    const res = await apiClient.get(API.POSTS.LIST, {
      params: {
        status,
        category: params.category,
        tag: params.tag,
        authorId: params.author,
        search: params.search,
        sort: params.sort,
        page: params.page,
        pageSize: params.limit,
      },
    });
    return paginate(res.data);
  },

  async getFeaturedPosts(): Promise<Post[]> {
    const res = await apiClient.get(API.POSTS.LIST, {
      params: { status: "PUBLISHED", pageSize: 50 },
    });
    return (res.data.posts as RawPost[])
      .filter((p) => p.isFeatured)
      .slice(0, 3)
      .map(adaptPost);
  },

  async getTrendingPosts(): Promise<Post[]> {
    const res = await apiClient.get(API.POSTS.LIST, {
      params: { status: "PUBLISHED", pageSize: 50 },
    });
    return (res.data.posts as RawPost[])
      .filter((p) => p.isTrending)
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 6)
      .map(adaptPost);
  },

  async getLatestPosts(limit = 6): Promise<Post[]> {
    const res = await apiClient.get(API.POSTS.LIST, {
      params: { status: "PUBLISHED", pageSize: limit },
    });
    return (res.data.posts as RawPost[]).map(adaptPost);
  },

  async getPost(slug: string): Promise<Post | null> {
    try {
      const res = await apiClient.get(API.POSTS.SLUG(slug));
      return adaptPost(res.data.post as RawPost);
    } catch {
      return null;
    }
  },

  async getPostById(id: string): Promise<Post | null> {
    try {
      const res = await apiClient.get(API.POSTS.DETAILS(id));
      return adaptPost(res.data.post as RawPost);
    } catch {
      return null;
    }
  },

  async getRelatedPosts(postId: string, categoryId: string): Promise<Post[]> {
    const res = await apiClient.get(API.POSTS.LIST, {
      params: { categoryId, status: "PUBLISHED", pageSize: 4 },
    });
    return (res.data.posts as RawPost[])
      .filter((p) => p.id !== postId)
      .slice(0, 3)
      .map(adaptPost);
  },

  async createPost(data: PostWritePayload): Promise<ApiResponse<Post>> {
    try {
      const uploaded = await uploadFeaturedImage(data.featuredImage);
      const res = await apiClient.post(API.POSTS.CREATE, {
        ...toApiPayload(data),
        ...(uploaded ?? {}),
      });
      return {
        success: true,
        data: adaptPost(res.data.post as RawPost),
        message: "Post created successfully",
      };
    } catch (err) {
      return {
        success: false,
        data: null as unknown as Post,
        message: errorMessage(err, "Failed to create post"),
      };
    }
  },

  async updatePost(
    id: string,
    data: Partial<PostWritePayload>,
  ): Promise<ApiResponse<Post>> {
    try {
      const uploaded = await uploadFeaturedImage(data.featuredImage);
      const res = await apiClient.patch(API.POSTS.UPDATE(id), {
        ...toApiPayload(data),
        ...(uploaded ?? {}),
      });
      return {
        success: true,
        data: adaptPost(res.data.post as RawPost),
        message: "Post updated successfully",
      };
    } catch (err) {
      return {
        success: false,
        data: null as unknown as Post,
        message: errorMessage(err, "Failed to update post"),
      };
    }
  },

  async deletePost(id: string): Promise<ApiResponse<null>> {
    try {
      await apiClient.delete(API.POSTS.DELETE(id));
      return { success: true, data: null, message: "Post deleted successfully" };
    } catch (err) {
      return {
        success: false,
        data: null,
        message: errorMessage(err, "Failed to delete post"),
      };
    }
  },

  async likePost(id: string): Promise<{ liked: boolean; likeCount: number }> {
    const res = await apiClient.post(`/api/posts/${id}/like`);
    return res.data;
  },

  async unlikePost(id: string): Promise<{ liked: boolean; likeCount: number }> {
    const res = await apiClient.delete(`/api/posts/${id}/like`);
    return res.data;
  },

  async bookmarkPost(id: string): Promise<{ bookmarked: boolean }> {
    const res = await apiClient.post(`/api/posts/${id}/bookmark`);
    return res.data;
  },

  async unbookmarkPost(id: string): Promise<{ bookmarked: boolean }> {
    const res = await apiClient.delete(`/api/posts/${id}/bookmark`);
    return res.data;
  },

  async getMyBookmarks(params: QueryParams = {}): Promise<PaginatedResponse<Post>> {
    const res = await apiClient.get("/api/bookmarks", {
      params: { page: params.page, pageSize: params.limit },
    });
    return paginate(res.data);
  },

  async recordView(id: string, progress?: number): Promise<void> {
    await apiClient.post(`/api/posts/${id}/view`, { progress });
  },

  async getMyReadingHistory(): Promise<
    { post: Post; progress: number; lastViewedAt: string }[]
  > {
    const res = await apiClient.get("/api/reading-history", {
      params: { pageSize: 50 },
    });
    return (
      res.data.entries as {
        post: RawPost;
        progress: number;
        lastViewedAt: string;
      }[]
    ).map((e) => ({
      post: adaptPost(e.post),
      progress: e.progress,
      lastViewedAt: e.lastViewedAt,
    }));
  },

  async removeFromHistory(postId: string): Promise<void> {
    await apiClient.delete(`/api/reading-history/${postId}`);
  },

  async clearHistory(): Promise<void> {
    await apiClient.delete("/api/reading-history");
  },
};
