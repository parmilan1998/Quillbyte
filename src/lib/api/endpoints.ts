export const API = {
  // AI
  AI: {
    GENERATE_POST: "/api/ai/generate-post",
    GENERATE_TITLE: "/api/ai/generate-title",
    GENERATE_SUMMARY: "/api/ai/generate-summary",
    GENERATE_TAGS: "/api/ai/generate-tags",
    IMPROVE_CONTENT: "/api/ai/improve-content",
  },

  // Authentication
  AUTH: {
    SIGN_IN: "/api/auth/sign-in",
    SIGN_UP: "/api/auth/sign-up",
    SIGN_OUT: "/api/auth/sign-out",
    SESSION: "/api/auth/session",
  },

  // Users
  USERS: {
    ME: "/api/users/me",
    PROFILE: (username: string) => `/api/users/${username}`,
    UPDATE_PROFILE: "/api/users/profile",
    CHANGE_PASSWORD: "/api/users/change-password",
    DELETE_ACCOUNT: "/api/users/delete-account",
  },

  // Posts
  POSTS: {
    LIST: "/api/posts",
    CREATE: "/api/posts",
    TRENDING: "/api/posts/trending",
    FEATURED: "/api/posts/featured",
    DRAFTS: "/api/posts/drafts",
    PUBLISHED: "/api/posts/published",
    SEARCH: "/api/posts/search",
    SLUG: (slug: string) => `/api/posts/slug/${slug}`,
    DETAILS: (id: string) => `/api/posts/${id}`,
    UPDATE: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
    PUBLISH: (id: string) => `/api/posts/${id}/publish`,
    UNPUBLISH: (id: string) => `/api/posts/${id}/unpublish`,
  },

  // =========================
  // Categories
  // =========================
  CATEGORIES: {
    LIST: "/api/categories",
    CREATE: "/api/categories",
    DETAILS: (id: string) => `/api/categories/${id}`,
    UPDATE: (id: string) => `/api/categories/${id}`,
    DELETE: (id: string) => `/api/categories/${id}`,
  },

  // =========================
  // Tags
  // =========================
  TAGS: {
    LIST: "/api/tags",
    CREATE: "/api/tags",
    DETAILS: (id: string) => `/api/tags/${id}`,
    UPDATE: (id: string) => `/api/tags/${id}`,
    DELETE: (id: string) => `/api/tags/${id}`,
    TRENDING: "/api/tags/trending",
  },

  // =========================
  // Comments
  // =========================
  COMMENTS: {
    LIST: (postId: string) => `/api/posts/${postId}/comments`,
    CREATE: (postId: string) => `/api/posts/${postId}/comments`,
    UPDATE: (id: string) => `/api/comments/${id}`,
    DELETE: (id: string) => `/api/comments/${id}`,
    REPLY: (id: string) => `/api/comments/${id}/reply`,
  },

  // =========================
  // Likes
  // =========================
  LIKES: {
    TOGGLE: (postId: string) => `/api/posts/${postId}/like`,
    LIST: (postId: string) => `/api/posts/${postId}/likes`,
  },

  // =========================
  // Bookmarks
  // =========================
  BOOKMARKS: {
    LIST: "/api/bookmarks",
    ADD: (postId: string) => `/api/posts/${postId}/bookmark`,
    REMOVE: (postId: string) => `/api/posts/${postId}/bookmark`,
  },

  // =========================
  // Follow
  // =========================
  FOLLOW: {
    FOLLOW: (userId: string) => `/api/users/${userId}/follow`,
    UNFOLLOW: (userId: string) => `/api/users/${userId}/follow`,
    FOLLOWERS: (userId: string) => `/api/users/${userId}/followers`,
    FOLLOWING: (userId: string) => `/api/users/${userId}/following`,
  },

  // =========================
  // Notifications
  // =========================
  NOTIFICATIONS: {
    LIST: "/api/notifications",
    READ: (id: string) => `/api/notifications/${id}/read`,
    READ_ALL: "/api/notifications/read-all",
    DELETE: (id: string) => `/api/notifications/${id}`,
  },

  // =========================
  // Search
  // =========================
  SEARCH: {
    GLOBAL: "/api/search",
    POSTS: "/api/search/posts",
    USERS: "/api/search/users",
    TAGS: "/api/search/tags",
  },

  // =========================
  // Uploads
  // =========================
  UPLOADS: {
    IMAGE: "/api/upload",
  },

  // =========================
  // Dashboard
  // =========================
  DASHBOARD: {
    STATS: "/api/dashboard/stats",
    ANALYTICS: "/api/dashboard/analytics",
  },

  // =========================
  // Admin
  // =========================
  ADMIN: {
    USERS: "/api/admin/users",
    POSTS: "/api/admin/posts",
    COMMENTS: "/api/admin/comments",
    CATEGORIES: "/api/admin/categories",
    TAGS: "/api/admin/tags",
    REPORTS: "/api/admin/reports",
  },
} as const;
