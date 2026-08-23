"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderOpen,
  MoreHorizontal,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/common/EmptyState";
import { CategoryService } from "@/services/client/category-service";
import type { Category } from "@/types";
import { toast } from "sonner";

const PALETTE = [
  "#61DAFB",
  "#3178C6",
  "#FF6B6B",
  "#4ECDC4",
  "#A78BFA",
  "#F59E0B",
  "#68D391",
  "#FCA5A5",
  "#818CF8",
  "#34D399",
  "#FB923C",
  "#F472B6",
  "#2563EB",
  "#7C3AED",
  "#0EA5E9",
];

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAll(),
  });
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#2563EB",
  });

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["categories"] });

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setIsSaving(true);
    try {
      if (editTarget) {
        await CategoryService.update(editTarget.id, form);
        toast.success("Category updated");
      } else {
        await CategoryService.create(form);
        toast.success("Category created");
      }
      invalidate();
      setEditTarget(null);
      setIsAddOpen(false);
      setForm({ name: "", slug: "", description: "", color: "#2563EB" });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Something went wrong. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await CategoryService.delete(id);
      toast.success("Category deleted");
      invalidate();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Failed to delete category",
      );
    } finally {
      setDeleteId(null);
    }
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      color: cat.color,
    });
    setIsAddOpen(true);
  };

  const totalPosts = categories.reduce((s, c) => s + c.postCount, 0);

  return (
    <div className="space-y-5 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} categories · {totalPosts} total articles
          </p>
        </div>
        <Button
          onClick={() => {
            setEditTarget(null);
            setForm({ name: "", slug: "", description: "", color: "#2563EB" });
            setIsAddOpen(true);
          }}
          className=" cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: categories.length },
          { label: "Total Posts", value: totalPosts },
          {
            label: "Largest",
            value:
              [...categories].sort((a, b) => b.postCount - a.postCount)[0]
                ?.name ?? "-",
          },
          { label: "Newest", value: categories[0]?.name ?? "-" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="font-bold text-sm truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* Search + Grid */}
      <div className="bg-card border rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading categories…
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No categories found"
            icon={<FolderOpen className="w-8 h-8 text-muted-foreground/40" />}
          />
        ) : (
          <div className="divide-y divide-border/60">
            {filtered.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
              >
                {/* Color swatch + icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  <FolderOpen
                    className="w-5 h-5"
                    style={{ color: cat.color }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{cat.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      /{cat.slug}
                    </span>
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {cat.description}
                    </p>
                  )}
                </div>

                <Badge
                  variant="secondary"
                  className="text-xs shrink-0"
                  style={{
                    backgroundColor: `${cat.color}15`,
                    color: cat.color,
                    borderColor: `${cat.color}25`,
                  }}
                >
                  {cat.postCount} posts
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(cat)}>
                      <Edit className="w-4 h-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-danger focus:text-danger"
                      onClick={() => setDeleteId(cat.id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editTarget ? "Edit Category" : "New Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                placeholder="e.g. React"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input
                placeholder="e.g. react"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description…"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="resize-none h-20"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, color: c })}
                    className="w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110 cursor-pointer"
                    style={{
                      backgroundColor: c,
                      borderColor: form.color === c ? "white" : "transparent",
                      outlineColor: form.color === c ? c : "transparent",
                      outline: form.color === c ? "2px solid" : "none",
                      outlineOffset: 1,
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="w-5 h-5 rounded border"
                  style={{ backgroundColor: form.color }}
                />
                <Input
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="font-mono text-sm h-7 w-28"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              className=" cursor-pointer"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className=" cursor-pointer">
              {isSaving
                ? "Saving…"
                : editTarget
                  ? "Save Changes"
                  : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category. Posts in this category
              will become uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger hover:bg-danger/90"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
