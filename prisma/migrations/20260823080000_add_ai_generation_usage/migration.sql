-- CreateTable
CREATE TABLE "ai_generation_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_generation_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_generation_usage_userId_month_key" ON "ai_generation_usage"("userId", "month");

-- CreateIndex
CREATE INDEX "ai_generation_usage_userId_idx" ON "ai_generation_usage"("userId");

-- AddForeignKey
ALTER TABLE "ai_generation_usage" ADD CONSTRAINT "ai_generation_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;