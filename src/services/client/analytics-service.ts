import type {
  AnalyticsSummary,
  AnalyticsDataPoint,
  TopPost,
  TrafficSource,
  DeviceStats,
} from "@/types";
import { MOCK_TRAFFIC_SOURCES, MOCK_DEVICE_STATS } from "@/mock/data";
import { apiClient } from "@/lib/api/apiClient";

export interface AnalyticsPayload {
  summary: AnalyticsSummary;
  dailyData: AnalyticsDataPoint[];
  topPosts: TopPost[];
}

// Summary/chart/top-posts are real, computed from actual data by a single
// GET /api/admin/analytics call (posts, comments, likes, users,
// subscribers) — one request, not three, since all three pieces come from
// the same endpoint; see the analytics page for how it's split back out
// after one useQuery call.
//
// Traffic sources and device stats stay mock below — there's no referrer
// or user-agent tracking anywhere in this app to compute them from; see
// AUDIT.md rather than inventing plausible-looking numbers for data that
// was never actually collected.
export const analyticsService = {
  async getAll(): Promise<AnalyticsPayload> {
    const res = await apiClient.get("/api/admin/analytics");
    return res.data;
  },

  // ─── Still mock: see file header note ─────────────────────────────────
  async getTrafficSources(): Promise<TrafficSource[]> {
    return MOCK_TRAFFIC_SOURCES;
  },

  async getDeviceStats(): Promise<DeviceStats[]> {
    return MOCK_DEVICE_STATS;
  },
};
