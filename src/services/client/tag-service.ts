import { apiClient } from "@/lib/api/apiClient";
import { API } from "@/lib/api/endpoints";
import type { Tag as TagType } from "@/types";

export const TagService = {
  async getAll(search?: string) {
    const res = await apiClient.get(API.TAGS.LIST, {
      params: { search },
    });
    return res.data.result as TagType[];
  },

  async create(data: {
    name: string;
    slug: string;
    color: string;
    description: string;
  }) {
    const res = await apiClient.post(API.TAGS.CREATE, data);
    return res.data.result as TagType;
  },

  async update(id: string, data: Partial<TagType>) {
    const res = await apiClient.put(API.TAGS.UPDATE(id), data);
    console.log({ res });

    return res.data.result;
  },

  async delete(id: string) {
    await apiClient.delete(API.TAGS.DELETE(id));
  },
};
