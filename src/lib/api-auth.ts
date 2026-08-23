import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const WRITE_ROLES = ["ADMIN", "USER"] as const;
export type AppRole = (typeof WRITE_ROLES)[number] | "READER";

export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  // Suspended/banned accounts keep a valid session cookie (this doesn't
  // touch sign-in/sign-out) but are rejected here, at the point every
  // protected route already goes through. NOTE: `session.user.status`
  // reflects whatever better-auth's session payload carries, which may
  // lag a moment behind a just-applied suspension depending on session
  // caching — this is a real check, not decorative, but not
  // instant-to-the-millisecond either.
  const status = (session.user as { status?: string }).status;
  if (status === "SUSPENDED" || status === "BANNED") {
    return {
      session: null,
      response: NextResponse.json(
        { message: "This account has been suspended" },
        { status: 403 },
      ),
    };
  }

  return { session, response: null as null };
}

export async function requireRole(roles: readonly string[] = WRITE_ROLES) {
  const { session, response } = await requireSession();
  if (response) return { session: null, response };

  const role = (session!.user as { role?: string }).role ?? "READER";

  if (!roles.includes(role)) {
    return {
      session: null,
      response: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { session, response: null as null };
}
