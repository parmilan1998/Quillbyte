// ─── Core Domain Types ───────────────────────────────────────────────────────

export type Role = "admin" | "editor" | "author" | "user";
export type PostStatus = "published" | "draft" | "scheduled" | "archived";
export type CommentStatus = "approved" | "pending" | "rejected" | "spam";
export type UserStatus = "active" | "suspended" | "banned" | "unverified";
export type NotificationType =
  | "comment"
  | "like"
  | "follow"
  | "mention"
  | "system"
  | "publish";

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: Role;
  status: UserStatus;
  website?: string;
  location?: string;
  twitterHandle?: string;
  githubHandle?: string;
  linkedinHandle?: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isVerified: boolean;
  isFollowing?: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AuthUser extends User {
  token?: string;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  postCount: number;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Tag ─────────────────────────────────────────────────────────────────────

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  postCount: number;
  createdAt: string;
}

// ─── Post ─────────────────────────────────────────────────────────────────────

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  status: PostStatus;
  author: User;
  category: Category;
  tags: Tag[];
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  readingTime: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  tableOfContents?: TocItem[];
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

// ─── Comment ─────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  postId: string;
  postTitle?: string;
  postSlug?: string;
  author: User;
  content: string;
  status: CommentStatus;
  parentId?: string;
  replies?: Comment[];
  likeCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  actor?: User;
  createdAt: string;
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  type: "image" | "video" | "document" | "other";
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  folderId?: string;
  uploadedBy: User;
  createdAt: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId?: string;
  fileCount: number;
  createdAt: string;
}

// ─── Subscriber ───────────────────────────────────────────────────────────────

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: "active" | "unsubscribed" | "bounced";
  source?: string;
  subscribedAt: string;
  unsubscribedAt?: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  totalViews: number;
  totalPosts: number;
  totalUsers: number;
  totalComments: number;
  totalSubscribers: number;
  totalLikes: number;
  viewsGrowth: number;
  postsGrowth: number;
  usersGrowth: number;
  commentsGrowth: number;
  likesGrowth: number;
  subscribersGrowth: number;
}

export interface AnalyticsDataPoint {
  date: string;
  views: number;
  visitors: number;
  comments: number;
  likes: number;
  newUsers: number;
}

export interface TopPost {
  id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  views: number;
  likes: number;
  comments: number;
}

export interface TrafficSource {
  source: string;
  visits: number;
  percentage: number;
}

export interface DeviceStats {
  device: string;
  sessions: number;
  percentage: number;
}

// ─── Pagination ────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  status?: string;
  category?: string;
  tag?: string;
  author?: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactEmail: string;
  supportEmail?: string;
  address?: string;
  phone?: string;
  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    defaultKeywords: string;
    googleAnalyticsId?: string;
    googleSearchConsoleId?: string;
  };
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  allowComments: boolean;
  moderateComments: boolean;
  postsPerPage: number;
}

// ─── Newsletter ────────────────────────────────────────────────────────────────

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: "newsletter" | "welcome" | "notification" | "digest";
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  templateId: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  recipientCount: number;
  openRate?: number;
  clickRate?: number;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export type ReportTargetType = "post" | "comment" | "user";
export type ReportReason =
  | "spam"
  | "harassment"
  | "misinformation"
  | "copyright"
  | "inappropriate"
  | "other";
export type ReportStatus = "pending" | "resolved" | "dismissed";

export interface Report {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  targetLabel?: string;
  reason: ReportReason;
  details?: string;
  status: ReportStatus;
  reporter: User;
  reviewedBy?: User;
  reviewedAt?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  user: User;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
