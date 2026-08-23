import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";

// GET /api/media — admin-only listing of the shared media library.
export async function GET(request: NextRequest) {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const folderId = searchParams.get("folderId");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Number(searchParams.get("pageSize") ?? "60"));

  const where = {
    ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
    ...(folderId === "unfiled"
      ? { folderId: null }
      : folderId
        ? { folderId }
        : {}),
  };

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where,
      include: { uploadedBy: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.media.count({ where }),
  ]);

  return NextResponse.json({
    media,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
