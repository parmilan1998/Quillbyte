import { Zap, LogOut, ChevronDown, Shield } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/constants";
import { getInitials } from "@/lib/utils";
import { authClient } from "@/lib/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth/logout.action";
import { ADMIN_MENU } from "@/constants/admin-menu";
import { USER_MENU } from "@/constants/user-menu";
import Image from "next/image";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const sessionUser = session?.user;
  const isAdmin = sessionUser?.role === "ADMIN";
  const menu = isAdmin ? ADMIN_MENU : USER_MENU;

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/auth/sign-in");
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1">
          <Link
            href="/"
            className="flex items-center gap-2 group-data-[collapsible=icon]:hidden"
          >
            <div className="w-7 h-7 flex items-center justify-center">
              <Image src="/icon.svg" alt="Logo" width={24} height={24} />
            </div>
            <span className="font-bold text-sm">{SITE.name}</span>
            {isAdmin && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                <Shield className="w-2.5 h-2.5 mr-0.5" />
                Admin
              </Badge>
            )}
          </Link>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => {
                if ("children" in item && item.children) {
                  return (
                    <Collapsible
                      key={item.label}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.label}
                            isActive={item.children.some((c) =>
                              isActive(c.href),
                            )}
                          >
                            <item.icon />
                            <span>{item.label}</span>
                            <ChevronDown className="ml-auto w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((child) => (
                              <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive(child.href)}
                                >
                                  <Link href={child.href}>{child.label}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                const navItem = item as {
                  label: string;
                  href: string;
                  icon: React.ElementType;
                  badge?: string;
                  exact?: boolean;
                };
                return (
                  <SidebarMenuItem key={navItem.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={navItem.label}
                      isActive={isActive(navItem.href, navItem.exact)}
                    >
                      <Link href={navItem.href}>
                        <navItem.icon />
                        <span>{navItem.label}</span>
                        {navItem.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-[10px] px-1.5 h-5"
                          >
                            {navItem.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user profile */}
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer"
              tooltip={sessionUser?.name ?? "User"}
            >
              <Avatar size="sm">
                <AvatarImage
                  src={sessionUser?.image ?? undefined}
                  alt={sessionUser?.name}
                />
                <AvatarFallback>
                  {sessionUser ? getInitials(sessionUser.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-semibold truncate max-w-32">
                  {sessionUser?.name}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {sessionUser?.role?.toLowerCase() ?? "user"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-danger cursor-pointer"
            >
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
