import { create } from "zustand";
import { aiClient } from "@/services/client/ai-service";

interface AIStore {
  loading: boolean;
  generatePost: (title: string) => Promise<string>;
}

export const useAIStore = create<AIStore>((set) => ({
  loading: false,
  generatePost: async (title) => {
    set({ loading: true });
    try {
      const { content } = await aiClient.generatePost(title);
      return content;
    } finally {
      set({ loading: false });
    }
  },
}));
