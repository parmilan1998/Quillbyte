import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth";

const subscribeSchema = z.object({ email: z.string().email() });

// POST /api/newsletter/subscribe — public. Re-subscribing an email that
// previously unsubscribed flips it back to SUBSCRIBED rather than erroring
// (upsert), since "I changed my mind" is a normal, expected case.
export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = subscribeSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please enter a valid email address" },
      { status: 422 },
    );
  }

  const { email } = parsed.data;

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email, status: "SUBSCRIBED" },
    update: { status: "SUBSCRIBED", unsubscribedAt: null },
  });

  return NextResponse.json({ success: true, message: "Subscribed!" });
}
