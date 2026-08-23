import { prisma } from "@/lib/auth";

interface LogActivityInput {
  userId: string;
  action: "published" | "created" | "updated" | "deleted" | "login";
  resource: string;
  resourceId?: string;
  details?: string;
}

// Shared by every call site that should show up in the admin activity
// feed. Deliberately fire-and-forget-safe, same pattern as
// createNotification: a logging failure should never fail the action
// that triggered it.
export async function logActivity(input: LogActivityInput) {
  try {
    await prisma.activityLog.create({ data: input });
  } catch {
    // Non-fatal — see comment above.
  }
}
