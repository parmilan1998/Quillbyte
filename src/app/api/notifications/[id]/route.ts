import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireSession } from "@/lib/api-auth";

// DELETE /api/notifications/:id — scoped to the caller's own notifications,
// same 404-not-403 reasoning as the read route.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const { id } = await params;
  const result = await prisma.notification.deleteMany({
    where: { id, recipientId: session!.user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ message: "Notification not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
