import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";
import { logActivity } from "@/lib/activity-log";

const updateCategorySchema = z.object({
  name: z.string().min(2).max(80).optional(),
  slug: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  color: z.string().optional(),
  icon: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  metaTitle: z.string().max(100).optional().nullable(),
  metaDescription: z.string().max(300).optional().nullable(),
  order: z.number().int().min(0).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

// ─── GET /api/categories/:id ──────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id, isDeleted: false },
    include: { _count: { select: { posts: true } } },
  });

  if (!category) {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...category,
    postCount: category._count.posts,
    _count: undefined,
  });
}

// ─── PATCH /api/categories/:id ────────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { id } = await params;

  const existing = await prisma.category.findUnique({
    where: { id, isDeleted: false },
  });
  if (!existing) {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }

  const json = await request.json();
  const parsed = updateCategorySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // Guard slug collision if slug is being changed
  if (parsed.data.slug && parsed.data.slug !== existing.slug) {
    const slugConflict = await prisma.category.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (slugConflict) {
      return NextResponse.json(
        { message: "A category with this slug already exists" },
        { status: 409 },
      );
    }
  }

  const category = await prisma.category.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ success: true, category });
}

// ─── DELETE /api/categories/:id ───────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { id } = await params;

  const existing = await prisma.category.findUnique({
    where: { id, isDeleted: false },
  });
  if (!existing) {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }

  // Soft-delete to preserve post relationships
  await prisma.category.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });

  await logActivity({
    userId: session!.user.id,
    action: "deleted",
    resource: "category",
    resourceId: id,
    details: existing.name,
  });

  return NextResponse.json({ success: true });
}
