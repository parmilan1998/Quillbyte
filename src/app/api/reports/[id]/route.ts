import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";
import { logActivity } from "@/lib/activity-log";

const updateSchema = z.object({
  status: z.enum(["RESOLVED", "DISMISSED"]),
});

// PATCH /api/reports/:id — admin-only. Resolving/dismissing is separate
// from actually acting on the reported content (deleting a post/comment,
// suspending a user) — those already have their own real endpoints
// (DELETE /api/posts/:id, PATCH /api/comments/:id, PATCH
// /api/admin/users/:id). This just closes the report itself.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { id } = await params;
  const existing = await prisma.report.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ message: "Report not found" }, { status: 404 });
  }

  const json = await request.json();
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const report = await prisma.report.update({
    where: { id },
    data: {
      status: parsed.data.status,
      reviewedById: session!.user.id,
      reviewedAt: new Date(),
    },
  });

  await logActivity({
    userId: session!.user.id,
    action: "updated",
    resource: "report",
    resourceId: id,
    details: `${parsed.data.status.toLowerCase()}: ${existing.targetType.toLowerCase()} report`,
  });

  return NextResponse.json({ success: true, report });
}
