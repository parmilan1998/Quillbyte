"use client";

import { authClient } from "@/lib/client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoader, startPageLoading } from "@/components/ui/page-loader";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) {
      startPageLoading();
      router.replace("/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <PageLoader message="Preparing your workspace" />;
  }

  if (session) {
    return null;
  }

  return <div className="min-h-screen flex flex-col">{children}</div>;
}
