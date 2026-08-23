import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { requireSession } from "@/lib/api-auth";
import { createNotification } from "@/lib/notifications";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const { id: followingId } = await params;
  const followerId = session!.user.id;

  if (followingId === followerId) {
    return NextResponse.json(
      { message: "You can't follow yourself" },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({
    where: { id: followingId },
    select: { id: true },
  });
  if (!target) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId, followingId } },
    create: { followerId, followingId },
    update: {},
  });

  try {
    await createNotification({
      recipientId: followingId,
      actorId: followerId,
      type: "FOLLOW",
      entityId: followerId,
      entityType: "user",
      message: `${session!.user.name} followed you`,
    });
  } catch {
    // Notification failure shouldn't fail the follow itself.
  }

  const followerCount = await prisma.follow.count({ where: { followingId } });
  return NextResponse.json({ following: true, followerCount });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response: authError } = await requireSession();
  if (authError) return authError;

  const { id: followingId } = await params;
  const followerId = session!.user.id;

  await prisma.follow.deleteMany({ where: { followerId, followingId } });

  const followerCount = await prisma.follow.count({ where: { followingId } });
  return NextResponse.json({ following: false, followerCount });
}
