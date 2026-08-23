import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";
import cloudinary from "@/lib/cloudinary/cloudinary";

const moveSchema = z.object({ folderId: z.string().nullable() });

// PATCH /api/media/:id — admin-only. Currently just moves a file into (or
// out of, with folderId: null) a folder — not a general media-edit route.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { id } = await params;
  const json = await request.json();
  const parsed = moveSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request" }, { status: 422 });
  }

  const media = await prisma.media
    .update({ where: { id }, data: { folderId: parsed.data.folderId } })
    .catch(() => null);
  if (!media) {
    return NextResponse.json({ message: "File not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, media });
}

// DELETE /api/media/:id — admin-only. Removes from Cloudinary and the DB
// together, by database id (not publicId — this is the library-management
// path, distinct from POST /api/upload's own publicId-based cleanup used
// when a post's featured image is simply being replaced).
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ message: "File not found" }, { status: 404 });
  }

  await cloudinary.uploader.destroy(media.publicId).catch(() => null);
  await prisma.media.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
