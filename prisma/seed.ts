import "dotenv/config";

import { runAdminSeed } from "./seeds/admin.seed";
import { runCategorySeed } from "./seeds/category.seed";
import { runPostSeed } from "./seeds/post.seed";
import { runTagSeed } from "./seeds/tag.seed";
import { prisma, disconnectSeedPrisma } from "./seeds/client";

async function runSeeds() {
  console.log("\n🚀 ================================");
  console.log("   MINDFUL BLOG SEED SYSTEM START");
  console.log("================================\n");

  try {
    // 0. Verify Database Connection
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbErr: any) {
      console.error("❌ DATABASE CONNECTION ERROR:", dbErr?.message || dbErr);
      console.error(
        "👉 Please ensure PostgreSQL is running and your DATABASE_URL in .env is correct.\n",
      );
      process.exit(1);
    }

    console.log("👥 Running Users & Admin Seed...");
    await runAdminSeed();

    console.log("\n--------------------------------\n");

    console.log("📚 Running Category Seed...");
    await runCategorySeed();

    console.log("\n--------------------------------\n");

    console.log("🏷️ Running Tag Seed...");
    await runTagSeed();

    console.log("\n--------------------------------\n");

    console.log("📝 Running Post Seed...");
    await runPostSeed();

    console.log("🎉 ALL SEEDS COMPLETED SUCCESSFULLY!\n");
  } catch (error: any) {
    if (error?.code === "P2021" || error?.message?.includes("does not exist")) {
      console.error("\n❌ SEED FAILED: Database tables do not exist.");
      console.error(
        "👉 Fix by running: 'npx prisma db push' or 'npx prisma migrate dev' to sync your database schema first.\n",
      );
    } else {
      console.error("\n❌ SEED FAILED:", error);
    }
    process.exit(1);
  } finally {
    await disconnectSeedPrisma();
  }
}

runSeeds();
