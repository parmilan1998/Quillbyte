import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";
import { ApiResponse } from "@/lib/api-response";

const updateTagSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  slug: z.string().min(1).max(80).optional(),
  description: z.string().max(300).optional().nullable(),
  color: z.string().optional(),
});

// ─── GET /api/tags/:id ────────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const tag = await prisma.tag.findUnique({
      where: { id, isDeleted: false },
      include: { _count: { select: { posts: true } } },
    });

    if (!tag) {
      return ApiResponse({
        success: false,
        statusCode: 404,
        message: "Tag not found",
      });
    }

    const result = {
      ...tag,
      postCount: tag._count.posts,
      _count: undefined,
    };

    return ApiResponse({
      success: true,
      statusCode: 200,
      message: "Tag fetched successfully.",
      result,
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

// ─── PATCH /api/tags/:id ──────────────────────────────────────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { response: authError } = await requireRole(["ADMIN"]);
    if (authError) return authError;

    const { id } = await params;

    const existing = await prisma.tag.findUnique({
      where: { id, isDeleted: false },
    });
    if (!existing) {
      return ApiResponse({
        success: false,
        statusCode: 404,
        message: "Tag not found",
      });
    }

    const json = await request.json();
    const parsed = updateTagSchema.safeParse(json);

    if (!parsed.success) {
      return ApiResponse({
        success: false,
        statusCode: 422,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    // Guard slug collision if slug is being changed
    if (parsed.data.slug && parsed.data.slug !== existing.slug) {
      const slugConflict = await prisma.tag.findUnique({
        where: { slug: parsed.data.slug },
      });
      if (slugConflict) {
        return ApiResponse({
          success: false,
          statusCode: 409,
          message: "A tag with this slug already exists",
        });
      }
    }

    const result = await prisma.tag.update({
      where: { id },
      data: parsed.data,
    });

    return ApiResponse({
      success: true,
      statusCode: 200,
      message: "Tag updated successfully.",
      result,
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

// ─── DELETE /api/tags/:id ─────────────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { response: authError } = await requireRole(["ADMIN"]);
    if (authError) return authError;

    const { id } = await params;

    const existing = await prisma.tag.findUnique({
      where: { id, isDeleted: false },
    });
    if (!existing) {
      return ApiResponse({
        success: false,
        statusCode: 404,
        message: "Tag not found",
      });
    }

    // Soft-delete; cascade removes PostTag rows automatically
    await prisma.tag.update({
      where: { id },
      data: { isDeleted: true },
    });

    return ApiResponse({
      success: true,
      statusCode: 200,
      message: "Tag deleted successfully.",
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
