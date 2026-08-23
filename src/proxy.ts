import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function proxy(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const pathname = new URL(req.url).pathname;

  if (!session) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  const role = session.user.role;

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/dashboard") && role !== "USER") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
