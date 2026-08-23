"use client";

import type { ReactNode } from "react";
import DashboardLayout from "@/app/dashboard/layout";

// Thin client wrapper — the actual admin-role check happens server-side in
// admin/layout.tsx before this ever renders. This just wires up the shared
// dashboard chrome (sidebar/header) in its "admin" variant.
export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout variant="admin" requiredRole="admin">
      {children}
    </DashboardLayout>
  );
}
