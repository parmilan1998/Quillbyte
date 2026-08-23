import { apiClient } from "@/lib/api/apiClient";
import type { Report, ReportTargetType, ReportReason, User } from "@/types";

interface RawUser {
  id: string;
  name: string;
  image: string | null;
}
interface RawReport {
  id: string;
  targetType: "POST" | "COMMENT" | "USER";
  targetId: string;
  target: { id: string; title?: string; slug?: string; content?: string; name?: string } | null;
  reason: string;
  details: string | null;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  reporter: RawUser;
  reviewedBy: { id: string; name: string } | null;
  reviewedAt: string | null;
  createdAt: string;
}

function adaptUser(u: RawUser): User {
  return {
    id: u.id,
    name: u.name,
    email: "",
    avatar: u.image ?? undefined,
    role: "author",
    status: "active",
    postCount: 0,
    followerCount: 0,
    followingCount: 0,
    isVerified: false,
    createdAt: "",
    updatedAt: "",
  };
}

function targetLabel(raw: RawReport): string {
  if (!raw.target) return "(deleted)";
  if (raw.targetType === "POST") return raw.target.title ?? "(untitled post)";
  if (raw.targetType === "COMMENT") return raw.target.content ?? "(comment)";
  return raw.target.name ?? "(user)";
}

function adaptReport(raw: RawReport): Report {
  return {
    id: raw.id,
    targetType: raw.targetType.toLowerCase() as Report["targetType"],
    targetId: raw.targetId,
    targetLabel: targetLabel(raw),
    reason: raw.reason.toLowerCase() as ReportReason,
    details: raw.details ?? undefined,
    status: raw.status.toLowerCase() as Report["status"],
    reporter: adaptUser(raw.reporter),
    reviewedBy: raw.reviewedBy
      ? {
          ...adaptUser({ id: raw.reviewedBy.id, name: raw.reviewedBy.name, image: null }),
        }
      : undefined,
    reviewedAt: raw.reviewedAt ?? undefined,
    createdAt: raw.createdAt,
  };
}

export const ReportService = {
  async create(
    targetType: ReportTargetType,
    targetId: string,
    reason: ReportReason,
    details?: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await apiClient.post("/api/reports", {
        targetType: targetType.toUpperCase(),
        targetId,
        reason: reason.toUpperCase(),
        details,
      });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message ?? "Failed to submit report",
      };
    }
  },

  async getAll(params: {
    status?: string;
    targetType?: string;
  } = {}): Promise<Report[]> {
    const res = await apiClient.get("/api/reports", {
      params: { ...params, pageSize: 100 },
    });
    return (res.data.reports as RawReport[]).map(adaptReport);
  },

  async resolve(id: string): Promise<void> {
    await apiClient.patch(`/api/reports/${id}`, { status: "RESOLVED" });
  },

  async dismiss(id: string): Promise<void> {
    await apiClient.patch(`/api/reports/${id}`, { status: "DISMISSED" });
  },
};
