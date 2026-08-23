import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireSession } from "@/lib/api-auth";

// PATCH /api/notifications/:id/read — mark one notification read. Scoped
// to the caller's own notifications; a 404 (not a 403) on someone else's
// notification, so this endpoint doesn't leak which ids exist.
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const { id } = await params;
  const result = await prisma.notification.updateMany({
    where: { id, recipientId: session!.user.id },
    data: { read: true },
  });

  if (result.count === 0) {
    return NextResponse.json({ message: "Notification not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
