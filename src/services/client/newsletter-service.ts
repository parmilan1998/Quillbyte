import { apiClient } from "@/lib/api/apiClient";
import type { Subscriber, PaginatedResponse, QueryParams } from "@/types";

interface RawSubscriber {
  id: string;
  email: string;
  status: "SUBSCRIBED" | "UNSUBSCRIBED";
  subscribedAt: string;
  unsubscribedAt: string | null;
}

function adaptSubscriber(raw: RawSubscriber): Subscriber {
  return {
    id: raw.id,
    email: raw.email,
    status: raw.status === "SUBSCRIBED" ? "active" : "unsubscribed",
    subscribedAt: raw.subscribedAt,
    unsubscribedAt: raw.unsubscribedAt ?? undefined,
  };
}

// Subscriber list only — no campaign sending. See the note in
// prisma/schema.prisma and AUDIT.md: there's no configured email provider,
// so a real send pipeline isn't built. Campaigns/templates in the admin UI
// stay mock.
export const NewsletterService = {
  async subscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post("/api/newsletter/subscribe", { email });
      return { success: true, message: res.data.message ?? "Subscribed!" };
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message ?? "Failed to subscribe",
      };
    }
  },

  async unsubscribe(email: string): Promise<void> {
    await apiClient.post("/api/newsletter/unsubscribe", { email });
  },

  async getSubscribers(
    params: QueryParams = {},
  ): Promise<PaginatedResponse<Subscriber> & { activeCount: number }> {
    const res = await apiClient.get("/api/newsletter/subscribers", {
      params: {
        status:
          params.status && params.status !== "all"
            ? params.status.toUpperCase()
            : undefined,
        search: params.search,
        page: params.page,
        pageSize: params.limit,
      },
    });
    const { total, page, pageSize, totalPages, activeCount } = res.data;
    return {
      data: (res.data.subscribers as RawSubscriber[]).map(adaptSubscriber),
      activeCount,
      meta: {
        total,
        page,
        limit: pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  },

  async deleteSubscriber(id: string): Promise<void> {
    await apiClient.delete(`/api/newsletter/subscribers/${id}`);
  },
};
