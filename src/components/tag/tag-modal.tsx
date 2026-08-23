"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  editTarget: Tag | null;
  setEditTarget: (value: Tag | null) => void;
  form: {
    name: string;
    slug: string;
    color: string;
    description: string;
  };
  setForm: (value: {
    name: string;
    slug: string;
    color: string;
    description: string;
  }) => void;
  handleSave: () => void;
}

const TAG_COLORS = [
  { label: "Slate", value: "#64748b" },
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Green", value: "#22c55e" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Pink", value: "#ec4899" },
];

const TagModal = ({
  isOpen,
  setIsOpen,
  editTarget,
  setEditTarget,
  form,
  setForm,
  handleSave,
}: Props) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setEditTarget(null);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editTarget ? "Edit Tag" : "New Tag"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label>Tag Name</Label>
            <Input
              placeholder="e.g. Engineering"
              value={form.name}
              onChange={(e) => {
                const value = e.target.value;
                setForm({
                  ...form,
                  name: value,
                  slug: value
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, ""),
                });
              }}
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="font-mono text-sm"
            />
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <Label>Color</Label>
            <div className="flex flex-wrap items-center gap-2">
              {TAG_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => setForm({ ...form, color: c.value })}
                  className={cn(
                    "h-7 w-7 rounded-full ring-offset-2 ring-offset-background transition-all cursor-pointer",
                    form.color === c.value
                      ? "ring-2 ring-foreground scale-105"
                      : "ring-1 ring-border hover:scale-105",
                  )}
                  style={{ backgroundColor: c.value }}
                />
              ))}

              {/* Custom color input */}
              <div className="relative h-7 w-7">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  title="Custom color"
                />
                <div
                  className="h-7 w-7 rounded-full border border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground pointer-events-none"
                  style={{
                    backgroundColor: TAG_COLORS.some(
                      (c) => c.value === form.color,
                    )
                      ? undefined
                      : form.color,
                  }}
                >
                  {!TAG_COLORS.some((c) => c.value === form.color) && (
                    <span className="text-white drop-shadow">✓</span>
                  )}
                  {TAG_COLORS.some((c) => c.value === form.color) && "+"}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              placeholder="Optional description for this tag"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          {/* Live preview */}
          <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
              style={{ backgroundColor: form.color || "#64748b" }}
            >
              {form.name || "Tag preview"}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              /{form.slug || "slug"}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setEditTarget(null);
            }}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!form.name.trim()}
            className="cursor-pointer"
          >
            {editTarget ? "Save Changes" : "Create Tag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagModal;
