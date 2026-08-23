import { apiClient } from "@/lib/api/apiClient";
import type { MediaFile, User } from "@/types";

interface RawMedia {
  id: string;
  url: string;
  publicId: string;
  name: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  folderId: string | null;
  createdAt: string;
  uploadedBy: { id: string; name: string; image: string | null };
}

function fileTypeFrom(mimeType: string): MediaFile["type"] {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "document";
  return "other";
}

function adaptUploader(u: RawMedia["uploadedBy"]): User {
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

function adaptMedia(raw: RawMedia): MediaFile {
  return {
    id: raw.id,
    name: raw.name,
    url: raw.url,
    type: fileTypeFrom(raw.mimeType),
    mimeType: raw.mimeType,
    size: raw.size,
    width: raw.width ?? undefined,
    height: raw.height ?? undefined,
    folderId: raw.folderId ?? undefined,
    uploadedBy: adaptUploader(raw.uploadedBy),
    createdAt: raw.createdAt,
  };
}

export const MediaService = {
  async getAll(search?: string, folderId?: string): Promise<MediaFile[]> {
    const res = await apiClient.get("/api/media", {
      params: { search, folderId, pageSize: 100 },
    });
    return (res.data.media as RawMedia[]).map(adaptMedia);
  },

  async upload(file: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Deletes by media library id (Cloudinary + DB together) — see the note
  // on the DELETE /api/media/:id route for why this is distinct from
  // /api/upload's own publicId-based delete.
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/media/${id}`);
  },

  async moveToFolder(id: string, folderId: string | null): Promise<void> {
    await apiClient.patch(`/api/media/${id}`, { folderId });
  },

  async getFolders(): Promise<
    { id: string; name: string; fileCount: number; createdAt: string }[]
  > {
    const res = await apiClient.get("/api/media/folders");
    return res.data.folders;
  },

  async createFolder(name: string): Promise<void> {
    await apiClient.post("/api/media/folders", { name });
  },

  async deleteFolder(id: string): Promise<void> {
    await apiClient.delete(`/api/media/folders/${id}`);
  },
};
