import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";

// DELETE /api/newsletter/subscribers/:id — admin-only, removes a
// subscriber entirely (distinct from unsubscribing — this is admin
// list-management, not a self-service action).
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { id } = await params;
  await prisma.newsletterSubscriber.delete({ where: { id } }).catch(() => null);

  return NextResponse.json({ success: true });
}
