"use client";

import { Zap, Rss, Mail, ArrowRight, AtSign, Code2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SITE, NAV_LINKS } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/services/client/category-service";
import { NewsletterService } from "@/services/client/newsletter-service";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

const SOCIAL_LINKS = [
  { icon: AtSign, href: "https://twitter.com/devpulse", label: "Twitter" },
  { icon: Code2, href: "https://github.com/devpulse", label: "GitHub" },
  {
    icon: Link2,
    href: "https://linkedin.com/company/devpulse",
    label: "LinkedIn",
  },
  { icon: Rss, href: "/rss.xml", label: "RSS" },
];

export function Footer() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAll(),
  });
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsSubscribing(true);
    const result = await NewsletterService.subscribe(email.trim());
    setIsSubscribing(false);
    if (result.success) {
      toast.success("You're subscribed!");
      setEmail("");
    } else {
      toast.error(result.message);
    }
  };
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image src="/icon.svg" alt="Logo" width={24} height={24} />
              </div>
              <span className="font-bold text-lg">{SITE.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {SITE.description}
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {[...NAV_LINKS, { label: "Contact", href: "/contact" }].map(
                (link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-sm mb-1">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Weekly articles on React, TypeScript, and the modern web.
            </p>
            <form className="space-y-2" onSubmit={handleSubscribe}>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-9 text-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubscribing}
                  className="shrink-0 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
