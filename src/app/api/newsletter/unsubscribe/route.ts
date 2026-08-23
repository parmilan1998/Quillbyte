import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth";

const unsubscribeSchema = z.object({ email: z.string().email() });

// POST /api/newsletter/unsubscribe — public by design (unsubscribe links
// in emails aren't authenticated). SIMPLIFICATION WORTH KNOWING: this
// takes a bare email with no signed token, so anyone who knows an email
// address could unsubscribe it. A real deployment should sign unsubscribe
// links (e.g. a token embedded in the email) rather than trust a bare
// email param — flagged rather than silently shipped as if it were
// production-hardened.
export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = unsubscribeSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request" }, { status: 422 });
  }

  await prisma.newsletterSubscriber.updateMany({
    where: { email: parsed.data.email },
    data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
