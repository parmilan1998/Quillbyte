import { create } from "zustand";
import type { Tag as TagType } from "@/types";
import { toast } from "sonner";
import { TagService } from "@/services/client/tag-service";

export type DBTag = TagType;

export interface CreateTagInput {
  name: string;
  slug: string;
  color: string;
  description: string;
}

interface TagState {
  tags: TagType[];
  loading: boolean;
  search: string;
  fetchTags: (search?: string) => Promise<void>;
  createTag: (data: CreateTagInput) => Promise<void>;
  updateTag: (id: string, data: Partial<TagType>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  setSearch: (value: string) => void;
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  loading: false,
  search: "",

  setSearch: (value) => set({ search: value }),

  fetchTags: async (search) => {
    set({ loading: true });
    try {
      const tags = await TagService.getAll(search ?? get().search);
      set({ tags });
    } finally {
      set({ loading: false });
    }
  },

  createTag: async (data) => {
    const res = await TagService.create(data);
    set((state) => ({
      tags: [res, ...state.tags],
    }));
    toast.success("Tag created");
  },

  updateTag: async (id, data) => {
    const res = await TagService.update(id, data);

    console.log("rrrrrrrrrrr", res);

    set((state) => ({
      tags: state.tags.map((tag) => (tag.id === id ? res : tag)),
    }));

    toast.success("Tag updated");
  },

  deleteTag: async (id) => {
    await TagService.delete(id);

    set((state) => ({
      tags: state.tags.filter((t) => t.id !== id),
    }));

    toast.success("Tag deleted");
  },
}));
