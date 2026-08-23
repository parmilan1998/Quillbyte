"use client";

import { Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CategoryService } from "@/services/client/category-service";
import { TagService } from "@/services/client/tag-service";
import QuillEditor from "@/components/editor/QuillEditor";
import { TitleSlugCard } from "@/components/admin/post/Titleslugcard";
import { ExcerptCard } from "@/components/admin/post/Excerptcard";
import { FeaturedImageCard } from "@/components/admin/post/Featuredimagecard";
import { CategoryCard } from "@/components/admin/post/Categorycard";
import { TagsCard } from "@/components/admin/post/Tagscard";
import { ScheduleCard } from "@/components/admin/post/Schedulecard";
import { OptionsCard } from "@/components/admin/post/Optionscard";
import { PostFormHeader } from "@/components/admin/post/Postformheader";
import { SeoCard } from "@/components/admin/post/Seocard";
import { useCreatePostForm } from "@/hooks/use-create-posts";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAIStore } from "@/store/ai-store";
import { authClient } from "@/lib/client";
import clsx from "clsx";

export default function AdminCreatePostPage() {
  const { generatePost, loading: isGenerating } = useAIStore();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAll(),
  });
  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => TagService.getAll(),
  });

  const {
    watch,
    setValue,
    register,
    control,
    errors,
    isSubmitting,
    selectedTagIds,
    toggleTag,
    removeTag,
    featuredImagePreview,
    handleImageSelect,
    removeImage,
    wordCount,
    readingTime,
    isScheduled,
    handleTitleChange,
    handleContentChange,
    saveDraft,
    publish,
  } = useCreatePostForm("/dashboard/posts");

  const { data: session } = authClient.useSession();

  // This page has no author picker — the author is always the signed-in
  // user. authorId is still a required form field (shared with the admin
  // editor, which does let an admin reassign it), so it needs a real value
  // once the session loads or validation would fail with nothing to show
  // the user why.
  useEffect(() => {
    if (session?.user?.id) {
      setValue("authorId", session.user.id);
    }
  }, [session, setValue]);

  const title = watch("title") ?? "";

  const handleGenerateDescription = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      toast.error("Please enter a post title.");
      return;
    }

    try {
      const content = await generatePost(trimmedTitle);

      handleContentChange(content);

      toast.success("Article generated successfully.");
    } catch (error) {
      console.error("Failed to generate article:", error);

      toast.error("Failed to generate article.");
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5 max-w-6xl"
      >
        <PostFormHeader
          isSubmitting={isSubmitting}
          isScheduled={isScheduled}
          wordCount={wordCount}
          readingTime={readingTime}
          onSaveDraft={saveDraft}
          onPublish={publish}
        />

        {/* Draft/Publish are triggered explicitly from the header, so native
            form submission (e.g. Enter inside a text field) is disabled to
            avoid a second, ambiguous submit path. */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
            {/* ── Main ─────────────────────────────────────── */}
            <div className="space-y-4">
              <TitleSlugCard
                control={control}
                register={register}
                errors={errors}
                onTitleChange={handleTitleChange}
              />

              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <QuillEditor
                    value={field.value}
                    onChange={field.onChange}
                    isGenerating={isGenerating}
                    onGenerateAI={handleGenerateDescription}
                  />
                )}
              />
              {errors.content && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.content.message}
                </p>
              )}

              <ExcerptCard register={register} errors={errors} />
            </div>

            {/* ── Sidebar ──────────────────────────────────── */}
            <div className="space-y-4">
              <FeaturedImageCard
                preview={featuredImagePreview}
                onSelect={handleImageSelect}
                onRemove={removeImage}
              />
              <CategoryCard
                control={control}
                categories={categories}
                error={errors.categoryId?.message}
              />
              <TagsCard
                allTags={tags}
                selectedTagIds={selectedTagIds}
                onToggle={toggleTag}
                onRemove={removeTag}
              />
              <ScheduleCard
                register={register}
                error={errors.scheduledAt?.message}
              />
              <OptionsCard control={control} />
              <SeoCard register={register} />
            </div>
          </div>
        </form>
      </motion.div>
    </TooltipProvider>
  );
}
