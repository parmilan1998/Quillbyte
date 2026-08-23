import { NextResponse } from "next/server";
import { generateBlogPrompt } from "@/prompts/blog.prompt";
import { aiService } from "@/services/server/ai-service";
import { releaseAIGeneration, reserveAIGeneration } from "./ai-usage";

export async function generatePostController(req: Request, userId: string) {
  const body = await req.json();
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (!title) {
    return NextResponse.json(
      { message: "A post title is required." },
      { status: 400 },
    );
  }

  if (!(await reserveAIGeneration(userId))) {
    return NextResponse.json(
      { message: "Credit Insufficient" },
      { status: 429 },
    );
  }

  const prompt = generateBlogPrompt({ title });

  let content: string;
  try {
    content = await aiService.generatePost(prompt);
  } catch (error) {
    await releaseAIGeneration(userId);
    throw error;
  }

  if (!content.trim()) {
    return NextResponse.json(
      { message: "AI did not return any post content." },
      { status: 502 },
    );
  }

  return NextResponse.json({ content });
}
