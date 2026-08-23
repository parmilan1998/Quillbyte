import { apiClient } from "@/lib/api/apiClient";
import { API } from "@/lib/api/endpoints";
import type { Category } from "@/types";

export const CategoryService = {
  async getAll(search?: string) {
    const res = await apiClient.get(API.CATEGORIES.LIST, {
      params: { search },
    });
    return res.data.categories as Category[];
  },

  async create(data: {
    name: string;
    slug: string;
    color: string;
    description?: string;
  }) {
    const res = await apiClient.post(API.CATEGORIES.CREATE, data);
    return res.data.category as Category;
  },

  async update(id: string, data: Partial<Category>) {
    const res = await apiClient.put(API.CATEGORIES.UPDATE(id), data);
    return res.data.category as Category;
  },

  async delete(id: string) {
    await apiClient.delete(API.CATEGORIES.DELETE(id));
  },
};
