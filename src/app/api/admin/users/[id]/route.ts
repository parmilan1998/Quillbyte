import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";
import { logActivity } from "@/lib/activity-log";

// DELETE /api/admin/users/:id — admin-only. Deliberately does NOT call
// prisma.user.delete(): User → Post is onDelete: Cascade, so a real
// delete would silently wipe every post this person ever published (plus
// their comments, likes, etc, cascading further). Instead this
// anonymizes the account in place — scrubs name/email/image, force-logs
// them out (deletes their sessions), removes their credentials (deletes
// their accounts, so the old password/OAuth link can't be used to sign
// back in), and sets status to BANNED — while leaving the User row (and
// everything that references it) intact. This is the standard
// "right to be forgotten" pattern for a system where content should
// outlive the identity that created it.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { id } = await params;
  if (id === session!.user.id) {
    return NextResponse.json(
      { message: "You can't delete your own account" },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.session.deleteMany({ where: { userId: id } }),
    prisma.account.deleteMany({ where: { userId: id } }),
    prisma.user.update({
      where: { id },
      data: {
        name: "Deleted User",
        email: `deleted-${id}@deleted.invalid`,
        image: null,
        status: "BANNED",
        emailVerified: false,
      },
    }),
  ]);

  await logActivity({
    userId: session!.user.id,
    action: "deleted",
    resource: "user",
    resourceId: id,
    details: `anonymized: ${existing.name} (${existing.email})`,
  });

  return NextResponse.json({ success: true });
}

const updateSchema = z.object({
  role: z.enum(["USER", "ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "BANNED"]).optional(),
});

// PATCH /api/admin/users/:id — admin-only role/status changes. Deliberately
// does NOT support editing name/email/etc — this is account moderation,
// not a general user-edit endpoint (a user manages their own profile via
// /dashboard/settings).
//
// Self-lockout guard: an admin can't change their own role or status here
// — otherwise a single click could demote or suspend the only admin
// account with no way back in short of direct DB access.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { id } = await params;
  if (id === session!.user.id) {
    return NextResponse.json(
      { message: "You can't change your own role or status" },
      { status: 400 },
    );
  }

  const json = await request.json();
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  if (!parsed.data.role && !parsed.data.status) {
    return NextResponse.json({ message: "Nothing to update" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: parsed.data,
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  const changes = [
    parsed.data.role ? `role → ${parsed.data.role}` : null,
    parsed.data.status ? `status → ${parsed.data.status}` : null,
  ]
    .filter(Boolean)
    .join(", ");
  await logActivity({
    userId: session!.user.id,
    action: "updated",
    resource: "user",
    resourceId: user.id,
    details: `${user.name}: ${changes}`,
  });

  return NextResponse.json({ success: true, user });
}
