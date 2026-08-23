import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";

// DELETE /api/media/folders/:id — admin-only. Deleting a folder does not
// delete the files inside it (Media.folderId is onDelete: SetNull) — they
// just become unfiled again, same as any file never assigned to a folder.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { id } = await params;
  await prisma.mediaFolder.delete({ where: { id } }).catch(() => null);

  return NextResponse.json({ success: true });
}
