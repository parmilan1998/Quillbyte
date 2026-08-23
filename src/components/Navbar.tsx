import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  Bell,
  LogOut,
  Settings,
  LayoutDashboard,
  PenSquare,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS, SITE } from "@/constants";
import { cn, getInitials } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { NotificationService } from "@/services/client/notification-service";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";
import { authClient } from "@/lib/client";
import { startPageLoading } from "@/components/ui/page-loader";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: session } = authClient.useSession();

  const user = session?.user;
  const isAuthenticated = !!session;

  const isAdmin = user?.role === "ADMIN";

  const routes = {
    dashboard: isAdmin ? "/admin" : "/dashboard",
    settings: isAdmin ? "/admin/settings" : "/dashboard/settings",
    newPost: isAdmin ? "/admin/posts/new" : "/dashboard/posts/new",
    // Notifications aren't an admin-vs-user concept — every account has
    // one inbox, and there's no separate /admin/notifications page (it
    // was a dead link before this fix).
    notifications: "/dashboard/notifications",
  };

  const { data: notificationData } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => NotificationService.getAll(),
    enabled: isAuthenticated,
    refetchInterval: 30_000,
  });
  const unreadCount = notificationData?.unreadCount ?? 0;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      startPageLoading();
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    startPageLoading();
    router.push("/");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "border-b shadow-sm bg-background/80 backdrop-blur-lg border-transparent"
            : " border-b border-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[4.5rem]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 flex items-center justify-center">
                <Image
                  src="/icon.svg"
                  alt="Quillbyte logo"
                  width={36}
                  height={36}
                />
              </div>
              <div className="leading-none">
                <span className="font-bold text-lg tracking-tight block">
                  {SITE.name}
                </span>
                <span className="hidden lg:block text-[10px] text-muted-foreground mt-1 tracking-wide">
                  {SITE.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground cursor-pointer"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="w-4 h-4" />
              </Button>

              <ModeToggle />

              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  {/* Notifications */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-muted-foreground cursor-pointer"
                    onClick={() => router.push(routes.notifications)}
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="lg"
                    className="relative text-muted-foreground cursor-pointer"
                    onClick={() => router.push(routes.newPost)}
                  >
                    <PenSquare className="w-4 h-4" />
                  </Button>

                  {/* User menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="gap-2 px-2 h-10 cursor-pointer"
                      >
                        <Avatar className="rounded-full overflow-visible size-md">
                          <AvatarImage
                            src={user.image ?? undefined}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                          {user.name.split(" ")[0]}
                        </span>
                        <ChevronDown className="w-3 h-3 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span className="font-semibold">{user.name}</span>
                          <span className="text-xs text-muted-foreground font-normal truncate">
                            {user.email}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => router.push(routes.dashboard)}
                        className="cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push(routes.newPost)}
                        className="cursor-pointer"
                      >
                        <PenSquare className="w-4 h-4" />
                        Write a Post
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push(routes.settings)}
                        className="cursor-pointer"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-danger focus:text-danger"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className=" cursor-pointer"
                  >
                    <Link href="/auth/sign-in">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className=" cursor-pointer">
                    <Link href="/auth/sign-up">Get Started</Link>
                  </Button>
                </div>
              )}

              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden cursor-pointer"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center">
                          <Image
                            src="/icon.svg"
                            alt="Quillbyte logo"
                            width={32}
                            height={32}
                          />
                        </div>
                        <span className="font-bold">{SITE.name}</span>
                      </div>
                    </div>
                    <nav className="flex-1 p-4 space-y-1">
                      {NAV_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            isActive(link.href)
                              ? "text-primary bg-primary/8"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent",
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                      {isAuthenticated ? (
                        <>
                          <div className="pt-2 border-t mt-2">
                            <Link
                              href="/dashboard"
                              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                            >
                              Dashboard
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center px-3 py-2.5 cursor-pointer rounded-lg text-sm font-medium text-danger hover:bg-danger/10"
                            >
                              Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="pt-4 border-t mt-4 space-y-2">
                          <Button className="w-full cursor-pointer" asChild>
                            <Link href="/auth/register">Get Started</Link>
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full cursor-pointer"
                            asChild
                          >
                            <Link href="/auth/login">Sign In</Link>
                          </Button>
                        </div>
                      )}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-start justify-center pt-20 px-4"
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-xl"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, authors, topics…"
                  className="h-14 pl-12 pr-12 text-base rounded-2xl shadow-xl border-2 border-primary/20 focus-visible:border-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-center text-xs text-muted-foreground mt-2">
                Press{" "}
                <kbd className="bg-muted px-1.5 py-0.5 rounded-md text-xs">
                  Enter
                </kbd>{" "}
                to search
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
