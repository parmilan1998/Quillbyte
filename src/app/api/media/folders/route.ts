import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";

const createFolderSchema = z.object({ name: z.string().min(1).max(80) });

// GET /api/media/folders — admin-only, with a real file count per folder.
export async function GET() {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const folders = await prisma.mediaFolder.findMany({
    include: { _count: { select: { media: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    folders: folders.map((f) => ({
      id: f.id,
      name: f.name,
      fileCount: f._count.media,
      createdAt: f.createdAt,
    })),
  });
}

// POST /api/media/folders — admin-only.
export async function POST(request: NextRequest) {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const json = await request.json();
  const parsed = createFolderSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: "Name is required" }, { status: 422 });
  }

  const folder = await prisma.mediaFolder.create({
    data: { name: parsed.data.name },
  });

  return NextResponse.json({ success: true, folder }, { status: 201 });
}
