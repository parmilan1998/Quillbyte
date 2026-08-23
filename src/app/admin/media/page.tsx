"use client";

import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Upload,
  Trash2,
  Search,
  FolderPlus,
  Grid3X3,
  List,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MediaService } from "@/services/client/media-service";
import { formatBytes, formatDate } from "@/lib/utils";
import type { MediaFile } from "@/types";
import { toast } from "sonner";

export default function AdminMediaPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["media", search, activeFolder],
    queryFn: () => MediaService.getAll(search, activeFolder ?? undefined),
  });

  const { data: folders = [] } = useQuery({
    queryKey: ["media-folders"],
    queryFn: () => MediaService.getFolders(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["media"] });
    queryClient.invalidateQueries({ queryKey: ["media-folders"] });
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    await MediaService.createFolder(newFolderName.trim());
    setNewFolderName("");
    setIsNewFolderOpen(false);
    invalidate();
    toast.success("Folder created");
  };

  const handleDeleteFolder = async (id: string) => {
    await MediaService.deleteFolder(id);
    if (activeFolder === id) setActiveFolder(null);
    invalidate();
    toast.success("Folder deleted — files were kept, just unfiled");
  };

  const handleMoveToFolder = async (fileId: string, folderId: string | null) => {
    await MediaService.moveToFolder(fileId, folderId);
    invalidate();
    toast.success(folderId ? "Moved to folder" : "Removed from folder");
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setIsUploading(true);
    let failures = 0;
    for (const file of Array.from(fileList)) {
      try {
        await MediaService.upload(file);
      } catch {
        failures++;
      }
    }
    setIsUploading(false);
    invalidate();
    if (failures > 0) {
      toast.error(
        failures === fileList.length
          ? "Upload failed. Please try again."
          : `${failures} file(s) failed to upload.`,
      );
    } else {
      toast.success(
        fileList.length > 1 ? "Files uploaded!" : "File uploaded!",
      );
    }
  };

  const handleDelete = async (id: string) => {
    await MediaService.delete(id);
    setSelected(null);
    invalidate();
    toast.success("File deleted");
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  return (
    <div className="space-y-5 page-enter">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${files.length} files`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className=" cursor-pointer"
            onClick={() => setIsNewFolderOpen(true)}
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button
            size="sm"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className=" cursor-pointer"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Upload Files
          </Button>
        </div>
      </div>

      {/* Upload Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
          isDragging ? "border-primary bg-primary/5" : "hover:border-primary/40"
        }`}
      >
        <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          <span className="text-primary font-semibold">Click to upload</span> or
          drag and drop files
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          PNG, JPG, WebP up to 5MB
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-1 border rounded-lg p-0.5">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            className="h-7 w-7 cursor-pointer"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            className="h-7 w-7 cursor-pointer"
            onClick={() => setViewMode("list")}
          >
            <List className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Folder rail */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant={activeFolder === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setActiveFolder(null)}
        >
          All Files
        </Badge>
        {folders.map((folder) => (
          <Badge
            key={folder.id}
            variant={activeFolder === folder.id ? "default" : "outline"}
            className="cursor-pointer gap-1.5 group"
            onClick={() => setActiveFolder(folder.id)}
          >
            {folder.name} · {folder.fileCount}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFolder(folder.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>

      {/* Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {files.map((file, idx) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
              className="group relative aspect-square rounded-xl overflow-hidden border cursor-pointer hover:border-primary/40 transition-all"
              onClick={() => setSelected(file)}
            >
              <img
                src={file.thumbnailUrl ?? file.url}
                alt={file.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Badge
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 text-[10px]"
                >
                  View
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] text-white truncate">{file.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-2xl overflow-hidden">
          <div className="divide-y divide-border/60">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img
                    src={file.thumbnailUrl ?? file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.size)} ·{" "}
                    {formatDate(file.createdAt, "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 cursor-pointer"
                    title="Copy URL"
                    onClick={() => handleCopyUrl(file.url)}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-danger hover:bg-danger/10 cursor-pointer"
                    onClick={() => handleDelete(file.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm truncate">
              {selected?.name}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <img
                  src={selected.url}
                  alt={selected.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{selected.mimeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">
                    {formatBytes(selected.size)}
                  </span>
                </div>
                {selected.width && selected.height && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimensions</span>
                    <span className="font-medium">
                      {selected.width}×{selected.height}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uploaded by</span>
                  <span className="font-medium">
                    {selected.uploadedBy.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uploaded</span>
                  <span className="font-medium">
                    {formatDate(selected.createdAt)}
                  </span>
                </div>
              </div>
              {folders.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Folder</p>
                  <Select
                    value={selected.folderId ?? "none"}
                    onValueChange={(v) =>
                      handleMoveToFolder(selected.id, v === "none" ? null : v)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unfiled</SelectItem>
                      {folders.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 cursor-pointer"
                  onClick={() => handleCopyUrl(selected.url)}
                >
                  Copy URL
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className=" cursor-pointer"
                  onClick={() => handleDelete(selected.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Folder name</Label>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Post Covers"
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewFolderOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} className="cursor-pointer">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
