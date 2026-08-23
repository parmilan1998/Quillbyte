"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Zap } from "lucide-react";

export function startPageLoading() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("app:navigation-start"));
  }
}

// ─── Top Progress Bar ─────────────────────────────────────────────────────────
export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPath = useRef<string>("");

  const currentPath = pathname + searchParams.toString();

  useEffect(() => {
    const start = () => {
      setVisible(true);
      setProgress(10);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 85) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 85;
          }
          return p + Math.random() * 12;
        });
      }, 50);
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as HTMLElement).closest("a");
      if (!link || !link.href || link.target === "_blank" || link.download) {
        return;
      }

      const url = new URL(link.href);
      if (
        url.origin === window.location.origin &&
        url.href !== window.location.href
      ) {
        start();
      }
    };

    window.addEventListener("app:navigation-start", start);
    document.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("app:navigation-start", start);
      document.removeEventListener("click", handleClick);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (prevPath.current === currentPath) return;
    const isInitialRender = prevPath.current === "";
    prevPath.current = currentPath;

    if (isInitialRender) {
      setVisible(false);
      setProgress(0);
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    setVisible(true);
    setProgress(100);
    const finish = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 150);

    return () => clearTimeout(finish);
  }, [currentPath]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-9999 h-0.75 bg-transparent pointer-events-none">
      <div
        className="h-full bg-primary shadow-[0_0_8px_2px] shadow-primary/60 transition-all duration-300 ease-out rounded-r-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── Full-Screen Page Loader ──────────────────────────────────────────────────
export function PageLoader({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-9998 flex flex-col items-center justify-center bg-background">
      {/* Glowing logo mark */}
      <div className="relative mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Zap className="w-8 h-8 text-primary animate-pulse" />
        </div>
        {/* Ping ring */}
        <span className="absolute inset-0 rounded-2xl border border-primary/40 animate-ping" />
      </div>

      {/* Animated dots */}
      <div className="flex gap-1.5 mb-5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <p className="text-sm text-muted-foreground font-medium tracking-wide">
        {message}
      </p>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
