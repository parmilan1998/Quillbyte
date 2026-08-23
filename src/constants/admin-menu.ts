import {
  Activity,
  BarChart3,
  FileText,
  Flag,
  FolderOpen,
  Image,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Settings,
  Tag,
  Users,
} from "lucide-react";

export const ADMIN_MENU = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  {
    label: "Content",
    icon: FileText,
    children: [
      { label: "All Posts", href: "/admin/posts" },
      { label: "New Post", href: "/admin/posts/new" },
      { label: "Categories", href: "/admin/categories", icon: FolderOpen },
      { label: "Tags", href: "/admin/tags", icon: Tag },
    ],
  },
  {
    label: "Comments",
    href: "/admin/comments",
    icon: MessageSquare,
  },
  { label: "Reports", href: "/admin/reports", icon: Flag },
  { label: "Media Library", href: "/admin/media", icon: Image },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Activity Logs", href: "/admin/activity", icon: Activity },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
