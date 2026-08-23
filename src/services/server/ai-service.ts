import { gemini } from "@/lib/gemini/gemini";

export const aiService = {
  async generatePost(prompt: string) {
    const res = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return res.text ?? "";
  },
};
