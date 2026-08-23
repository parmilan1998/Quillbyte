import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireSession } from "@/lib/api-auth";

// DELETE /api/reading-history/:postId — remove one item from the caller's
// history.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const { postId } = await params;
  await prisma.readingHistory.deleteMany({
    where: { userId: session!.user.id, postId },
  });

  return NextResponse.json({ success: true });
}
