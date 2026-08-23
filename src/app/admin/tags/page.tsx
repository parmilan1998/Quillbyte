"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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

import type { Tag as TagType } from "@/types";
import { toast } from "sonner";
import { useTagStore } from "@/store";
import TagModal from "@/components/tag/tag-modal";
import TagSearch from "@/components/tag/tag-search";

export default function AdminTagsPage() {
  const {
    tags,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    search,
    setSearch,
  } = useTagStore();

  const [editTarget, setEditTarget] = useState<TagType | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    color: "",
    description: "",
  });

  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  // INIT LOAD
  useEffect(() => {
    fetchTags();
  }, []);

  // SAVE (CREATE / UPDATE)
  const handleSave = async () => {
    console.log("OPEN SAVE DIALOG");

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    console.log("✅ NAME IS OK");

    let response;

    try {
      if (editTarget) {
        response = await updateTag(editTarget.id, {
          name: form.name,
          slug: form.slug,
          color: form.color,
          description: form.description,
        });
        console.log("✅ UPDATE DONE");
        console.log({ response });
      } else {
        response = await createTag({
          name: form.name,
          slug: form.slug,
          color: form.color,
          description: form.description,
        });
        console.log("✅ CREATE DONE");
        console.log({ response });
      }

      console.log({ response });

      setEditTarget(null);
      setIsOpen(false);
      setForm({ name: "", slug: "", color: "", description: "" });
      console.log("✅ SAVE COMPLETE");
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await deleteTag(id);
      setDeleteId(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  // EDIT OPEN
  const openEdit = (tag: TagType) => {
    setEditTarget(tag);
    setForm({
      name: tag.name,
      slug: tag.slug,
      color: tag.color || "#838383ff",
      description: tag.description || "",
    });
    setIsOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tags</h1>
          <p className="text-sm text-muted-foreground">
            {tags.length} tags total
          </p>
        </div>

        <Button
          onClick={() => {
            setEditTarget(null);
            setForm({ name: "", slug: "", color: "", description: "" });
            setIsOpen(true);
          }}
          className="cursor-pointer"
        >
          New Tag
        </Button>
      </div>

      {/* SEARCH */}
      <TagSearch
        tags={tags}
        search={search}
        setSearch={setSearch}
        fetchTags={fetchTags}
        filtered={filtered}
        setDeleteId={setDeleteId}
        openEdit={openEdit}
      />

      {/* ADD / EDIT MODAL */}
      <TagModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editTarget={editTarget}
        setEditTarget={setEditTarget}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
      />

      {/* DELETE */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this tag.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
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
