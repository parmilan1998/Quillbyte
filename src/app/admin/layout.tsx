import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "./AdminShell";

// Server Component — this is the authoritative access check for everything
// under /admin. It runs before any admin page or its data renders, so an
// unauthorized request never receives admin markup or triggers admin data
// fetches. (The client-side check in DashboardLayout is a secondary UX
// guard only — this is the real boundary.)
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}
