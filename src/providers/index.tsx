"use client";

import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { SessionProvider } from "next-auth/react";
// import { Toaster } from "react-hot-toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {/* <SessionProvider session={session}> */}
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" />
            {/* <Toaster position="top-right" /> */}
          </TooltipProvider>
        </AuthProvider>
        {/* </SessionProvider> */}
      </QueryProvider>
    </ThemeProvider>
  );
}
