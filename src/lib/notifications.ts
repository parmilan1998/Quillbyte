import { prisma } from "@/lib/auth";

interface CreateNotificationInput {
  recipientId: string;
  actorId: string;
  type: "FOLLOW" | "POST_LIKE" | "POST_COMMENT" | "COMMENT_REPLY" | "COMMENT_LIKE";
  entityId?: string;
  entityType?: string;
  message: string;
}

// Shared by every route that can trigger a notification (like, comment,
// reply, comment-like, follow) so the "don't notify yourself" rule lives
// in exactly one place. Deliberately fire-and-forget-safe: a failure here
// should never fail the action that triggered it (a like/comment/follow
// should still succeed even if the notification insert has a problem), so
// callers should wrap this in its own try/catch rather than let it bubble.
export async function createNotification(input: CreateNotificationInput) {
  if (input.recipientId === input.actorId) return;

  await prisma.notification.create({
    data: {
      recipientId: input.recipientId,
      actorId: input.actorId,
      type: input.type,
      entityId: input.entityId,
      entityType: input.entityType,
      message: input.message,
    },
  });
}
