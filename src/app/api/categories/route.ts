import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";
import { logActivity } from "@/lib/activity-log";

// ─── Validation ───────────────────────────────────────────────────────────────

const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  slug: z.string().min(2, "Slug is required").max(100),
  description: z.string().max(500).optional().nullable(),
  color: z.string().optional().default("#6366f1"),
  icon: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  metaTitle: z.string().max(100).optional().nullable(),
  metaDescription: z.string().max(300).optional().nullable(),
  order: z.number().int().min(0).optional().default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE"),
});

// ─── GET /api/categories ──────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // "ACTIVE" | "INACTIVE" | null (all)
  const search = searchParams.get("search");
  const includeDeleted = searchParams.get("includeDeleted") === "true";

  const where = {
    ...(includeDeleted ? {} : { isDeleted: false }),
    ...(status ? { status: status as "ACTIVE" | "INACTIVE" } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const categories = await prisma.category.findMany({
    where,
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { posts: true } },
    },
  });

  return NextResponse.json({
    categories: categories.map((c) => ({
      ...c,
      postCount: c._count.posts,
      _count: undefined,
    })),
  });
}

// ─── POST /api/categories ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const { session, response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const json = await request.json();
  const parsed = createCategorySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Guard slug collision
  const existing = await prisma.category.findUnique({
    where: { slug: data.slug },
  });
  if (existing) {
    return NextResponse.json(
      { message: "A category with this slug already exists" },
      { status: 409 },
    );
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      color: data.color,
      icon: data.icon ?? null,
      imageUrl: data.imageUrl ?? null,
      metaTitle: data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,
      order: data.order,
      status: data.status,
    },
  });

  await logActivity({
    userId: session!.user.id,
    action: "created",
    resource: "category",
    resourceId: category.id,
    details: category.name,
  });

  return NextResponse.json({ success: true, category }, { status: 201 });
}
