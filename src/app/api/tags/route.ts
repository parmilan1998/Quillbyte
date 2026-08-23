import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";
import { ApiResponse } from "@/lib/api-response";

// ─── Validation ───────────────────────────────────────────────────────────────
const createTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  slug: z.string().min(1, "Slug is required").max(80),
  description: z.string().max(300).optional().nullable(),
  color: z.string().optional(),
});

// ─── GET /api/tags ────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;

    const tags = await prisma.tag.findMany({
      where: {
        isDeleted: false,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    const result = tags.map((tag: any) => ({
      ...tag,
      postCount: tag._count.posts,
      _count: undefined,
    }));

    return ApiResponse({
      success: true,
      statusCode: 200,
      message: "Tags fetched successfully.",
      result,
    });
  } catch (error) {
    return ApiResponse({
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
}

// ─── POST /api/tags ───────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { response: authError } = await requireRole(["ADMIN"]);
    if (authError) return authError;

    const json = await request.json();
    const parsed = createTagSchema.safeParse(json);

    if (!parsed.success) {
      return ApiResponse({
        success: false,
        statusCode: 422,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const data = parsed.data;

    // Guard slug collision
    const existing = await prisma.tag.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return ApiResponse({
        success: false,
        statusCode: 409,
        message: "A tag with this slug already exists",
      });
    }

    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        slug: data.slug,
        color: data.color ?? "#8b5cf6",
        description: data.description ?? null,
      },
    });

    return ApiResponse({
      success: true,
      statusCode: 201,
      message: "Tag created successfully.",
      result: tag,
    });
  } catch (error) {
    console.log(error);
    return ApiResponse({
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
}
