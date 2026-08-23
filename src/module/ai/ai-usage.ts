import { prisma } from "@/lib/auth";

export const AI_GENERATION_LIMIT = 5;

function currentMonth() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function reserveAIGeneration(userId: string) {
  const month = currentMonth();

  await prisma.aIGenerationUsage.upsert({
    where: { userId_month: { userId, month } },
    create: { userId, month },
    update: {},
  });

  const result = await prisma.aIGenerationUsage.updateMany({
    where: { userId, month, count: { lt: AI_GENERATION_LIMIT } },
    data: { count: { increment: 1 } },
  });

  return result.count === 1;
}

export async function releaseAIGeneration(userId: string) {
  await prisma.aIGenerationUsage.updateMany({
    where: { userId, month: currentMonth(), count: { gt: 0 } },
    data: { count: { decrement: 1 } },
  });
}
