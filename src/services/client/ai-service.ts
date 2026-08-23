import { apiClient } from "@/lib/api/apiClient";
import { API } from "@/lib/api/endpoints";

export const aiClient = {
  async generatePost(title: string) {
    try {
      const { data } = await apiClient.post(API.AI.GENERATE_POST, { title });

      if (typeof data?.content !== "string" || !data.content.trim()) {
        throw new Error("AI did not return any post content.");
      }

      return data as { content: string };
    } catch (error: any) {
      if (error?.response?.status === 429) {
        throw new Error("Credit Insufficient");
      }
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to generate the post right now.";
      throw new Error(message);
    }
  },
};
