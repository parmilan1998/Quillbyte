import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireSession } from "@/lib/api-auth";

export async function PATCH() {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  await prisma.notification.updateMany({
    where: { recipientId: session!.user.id, read: false },
    data: { read: true },
  });

  return NextResponse.json({ success: true });
}
