import {
  Bell,
  Bookmark,
  Clock,
  FileText,
  LayoutDashboard,
  MessageSquare,
  PenSquare,
  Settings,
  User,
} from "lucide-react";

export const USER_MENU = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "My Posts", href: "/dashboard/posts", icon: FileText },
  { label: "Write Post", href: "/dashboard/posts/new", icon: PenSquare },
  { label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { label: "Comments", href: "/dashboard/comments", icon: MessageSquare },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    badge: "4",
  },
  { label: "Reading History", href: "/dashboard/history", icon: Clock },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];
