export const SITE = {
  name: "Quillbyte",
  tagline: "Ideas worth shipping",
  description:
    "A modern publication for thoughtful engineering, product, and technology writing.",
  url: "https://quillbyte.dev",
  twitter: "@quillbyte",
  logo: "/icon.svg",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Categories", href: "/categories" },
  { label: "Authors", href: "/authors" },
  { label: "About", href: "/about" },
];

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  {
    label: "Content",
    icon: "BookOpen",
    children: [
      { label: "All Posts", href: "/admin/posts" },
      { label: "New Post", href: "/admin/posts/new" },
      { label: "Categories", href: "/admin/categories" },
      { label: "Tags", href: "/admin/tags" },
    ],
  },
  { label: "Comments", href: "/admin/comments", icon: "MessageSquare" },
  { label: "Media", href: "/admin/media", icon: "Image" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Newsletter", href: "/admin/newsletter", icon: "Mail" },
  { label: "Activity", href: "/admin/activity", icon: "Activity" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];

export const USER_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "My Posts", href: "/dashboard/posts", icon: "FileText" },
  { label: "Bookmarks", href: "/dashboard/bookmarks", icon: "Bookmark" },
  { label: "Comments", href: "/dashboard/comments", icon: "MessageSquare" },
  { label: "Notifications", href: "/dashboard/notifications", icon: "Bell" },
  { label: "Reading History", href: "/dashboard/history", icon: "Clock" },
  { label: "Profile", href: "/dashboard/profile", icon: "User" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
];

export const ROLE_COLORS = {
  admin: "bg-danger/15 text-danger border-danger/20",
  editor: "bg-violet/15 text-violet border-violet/20",
  author: "bg-sky/15 text-sky border-sky/20",
  user: "bg-muted text-muted-foreground border-border",
} as const;

export const STATUS_COLORS = {
  published: "bg-success/15 text-success border-success/20",
  draft: "bg-warning/15 text-warning-foreground border-warning/20",
  scheduled: "bg-sky/15 text-sky border-sky/20",
  archived: "bg-muted text-muted-foreground border-border",
  approved: "bg-success/15 text-success border-success/20",
  pending: "bg-warning/15 text-warning-foreground border-warning/20",
  rejected: "bg-danger/15 text-danger border-danger/20",
  spam: "bg-muted text-muted-foreground border-border",
  active: "bg-success/15 text-success border-success/20",
  suspended: "bg-warning/15 text-warning-foreground border-warning/20",
  banned: "bg-danger/15 text-danger border-danger/20",
  unverified: "bg-muted text-muted-foreground border-border",
} as const;
