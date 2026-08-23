"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { slugify, estimateReadingTime } from "@/lib/utils";
import { postService } from "@/services/client/post-service";
import { PostFormData, postFormSchema, PostStatus } from "@/types/post-form";
import { startPageLoading } from "@/components/ui/page-loader";

export type PostSubmitPayload = PostFormData & {
  tagIds: string[];
  featuredImage: File | null;
};

export function useCreatePostForm(redirectTo = "/admin/posts") {
  const router = useRouter();

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<
    string | null
  >(null);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  // Which action ("draft" | "published" | "scheduled") triggered the current
  // submit. Both toolbar buttons share one validated submit handler, so the
  // status is tracked here instead of relying on setValue()+handleSubmit()
  // ordering, which is fragile.
  const pendingStatusRef = useRef<PostStatus>("draft");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      categoryId: "",
      authorId: "",
      status: "draft",
      isFeatured: false,
      isTrending: false,
      scheduledAt: "",
      seoTitle: "",
      seoDescription: "",
    },
  });

  const scheduledAt = watch("scheduledAt");
  const isScheduled = Boolean(scheduledAt);

  // Release the object URL created for the image preview when it's replaced
  // or the component unmounts.
  useEffect(() => {
    return () => {
      if (featuredImagePreview) URL.revokeObjectURL(featuredImagePreview);
    };
  }, [featuredImagePreview]);

  const handleTitleChange = useCallback(
    (title: string) => {
      setValue("slug", slugify(title), { shouldValidate: true });
    },
    [setValue],
  );

  const handleContentChange = useCallback(
    (html: string) => {
      setValue("content", html, { shouldValidate: true });
      const words = html
        .replace(/<[^>]*>/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      setWordCount(words.length);
      setReadingTime(estimateReadingTime(html));
    },
    [setValue],
  );

  const toggleTag = useCallback((tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  }, []);

  const removeTag = useCallback((tagId: string) => {
    setSelectedTagIds((prev) => prev.filter((id) => id !== tagId));
  }, []);

  const handleImageSelect = useCallback((file: File | null) => {
    setFeaturedImage(file);
    setFeaturedImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  }, []);

  const removeImage = useCallback(() => {
    handleImageSelect(null);
  }, [handleImageSelect]);

  const buildPayload = useCallback(
    (data: PostFormData, status: PostStatus): PostSubmitPayload => ({
      ...data,
      status,
      tagIds: selectedTagIds,
      featuredImage,
    }),
    [featuredImage, selectedTagIds],
  );

  const submitPost = handleSubmit(async (data) => {
    const status = pendingStatusRef.current;
    const payload = buildPayload(data, status);

    try {
      const result = await postService.createPost(payload);
      if (result?.success) {
        toast.success(
          status === "scheduled"
            ? "Post scheduled!"
            : status === "published"
              ? "Post published!"
              : "Draft saved!",
        );
        startPageLoading();
        router.push(redirectTo);
      } else {
        toast.error(
          result?.message ?? "Something went wrong. Please try again.",
        );
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  });

  const saveDraft = useCallback(() => {
    pendingStatusRef.current = "draft";
    setValue("status", "draft");
    void submitPost();
  }, [setValue, submitPost]);

  const publish = useCallback(() => {
    const status: PostStatus = getValues("scheduledAt")
      ? "scheduled"
      : "published";
    pendingStatusRef.current = status;
    setValue("status", status);
    void submitPost();
  }, [getValues, setValue, submitPost]);

  return {
    watch,
    setValue,
    register,
    control,
    errors,
    isSubmitting,
    selectedTagIds,
    toggleTag,
    removeTag,
    featuredImage,
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
  };
}
