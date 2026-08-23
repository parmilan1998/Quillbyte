import { create } from "zustand";
import { apiClient } from "@/lib/api/apiClient";
import { API } from "@/lib/api/endpoints";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DBCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  icon: string | null;
  imageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  status: "ACTIVE" | "INACTIVE";
  order: number;
  postCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string | null;
  color?: string;
  icon?: string | null;
  imageUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  order?: number;
  status?: "ACTIVE" | "INACTIVE";
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface CategoryStore {
  categories: DBCategory[];
  isLoading: boolean;
  error: string | null;

  fetchCategories: (search?: string) => Promise<void>;
  createCategory: (data: CreateCategoryInput) => Promise<DBCategory>;
  updateCategory: (id: string, data: Partial<CreateCategoryInput>) => Promise<DBCategory>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async (search) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams({ status: "ACTIVE" });
      if (search) params.set("search", search);

      const { data } = await apiClient.get(
        `${API.CATEGORIES.LIST}?${params.toString()}`,
      );
      set({ categories: data.categories });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch categories";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  createCategory: async (input) => {
    const { data } = await apiClient.post(API.CATEGORIES.CREATE, input);
    const newCategory: DBCategory = data.category;
    set((state) => ({
      categories: [...state.categories, newCategory].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    }));
    return newCategory;
  },

  updateCategory: async (id, input) => {
    const { data } = await apiClient.patch(API.CATEGORIES.UPDATE(id), input);
    const updated: DBCategory = data.category;
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? updated : c)),
    }));
    return updated;
  },

  deleteCategory: async (id) => {
    await apiClient.delete(API.CATEGORIES.DELETE(id));
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
  },
}));
