import "dotenv/config";
import { Role } from "@/generated/prisma/client";
import { prisma } from "./client";
import { auth } from "@/lib/auth";
import { hashPassword } from "better-auth/crypto";

const adminEmail = process.env.ADMIN_EMAIL || "blogmint@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD || "Blogmint2026@@";
const credentialIssuer = "local:credential";

const ensureCredentialAccount = async (userId: string, password: string) => {
  const account = await prisma.account.findFirst({
    where: { userId, providerId: "credential" },
  });

  if (!account) {
    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: userId,
        providerId: "credential",
        userId,
        issuer: credentialIssuer,
        password: await hashPassword(password),
      },
    });
    return;
  }

  if (account.issuer !== credentialIssuer || account.accountId !== userId) {
    await prisma.account.update({
      where: { id: account.id },
      data: { issuer: credentialIssuer, accountId: userId },
    });
  }
};

export const initialUsers = [
  {
    name: "Administrator",
    email: adminEmail,
    role: Role.ADMIN,
    password: adminPassword,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: Role.USER,
    password: "User123456@@",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Marcus Vance",
    email: "marcus.vance@example.com",
    role: Role.USER,
    password: "User123456@@",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Elena Rostova",
    email: "elena.rostova@example.com",
    role: Role.USER,
    password: "User123456@@",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    role: Role.USER,
    password: "User123456@@",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Emma Watson",
    email: "emma.watson@example.com",
    role: Role.USER,
    password: "User123456@@",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "David Kim",
    email: "david.kim@example.com",
    role: Role.USER,
    password: "User123456@@",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    role: Role.USER,
    password: "User123456@@",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
];

export const runAdminSeed = async () => {
  console.log("👥 Running Users & Admin Seed...");

  for (const u of initialUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: u.email },
    });

    if (existingUser) {
      if (u.role === Role.ADMIN && existingUser.role !== Role.ADMIN) {
        await prisma.user.update({
          where: { email: u.email },
          data: {
            role: Role.ADMIN,
            emailVerified: true,
          },
        });
      }
      if (u.image && !existingUser.image) {
        await prisma.user.update({
          where: { email: u.email },
          data: { image: u.image },
        });
      }
      await ensureCredentialAccount(existingUser.id, u.password);
      console.log(`⏭️ User already exists (updated if needed): ${u.email}`);
      continue;
    }

    try {
      // Try Better Auth signup first
      await auth.api.signUpEmail({
        body: {
          name: u.name,
          email: u.email,
          password: u.password,
        },
      });

      await prisma.user.update({
        where: { email: u.email },
        data: {
          role: u.role,
          emailVerified: true,
          image: u.image,
        },
      });
      await ensureCredentialAccount(
        (await prisma.user.findUniqueOrThrow({ where: { email: u.email } })).id,
        u.password,
      );

      console.log(`➕ Created user via Better-Auth: ${u.email} (${u.role})`);
    } catch (err) {
      // Fallback: Direct Prisma user creation if better-auth signup has secondary issues (e.g. email provider warning)
      const fallbackId = crypto.randomUUID();
      const fallbackUser = await prisma.user.create({
        data: {
          id: fallbackId,
          name: u.name,
          email: u.email,
          role: u.role,
          emailVerified: true,
          image: u.image,
          status: "ACTIVE",
        },
      });
      await ensureCredentialAccount(fallbackUser.id, u.password);
      console.log(
        `➕ Created user via Prisma fallback: ${u.email} (${u.role})`,
      );
    }
  }

  console.log("🎉 Users & Admin seed completed.");
};
