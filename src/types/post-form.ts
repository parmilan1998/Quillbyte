import { z } from "zod";

export const POST_STATUSES = [
  "draft",
  "published",
  "scheduled",
  "archived",
] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const postFormSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    slug: z.string().min(3, "Slug is required"),
    excerpt: z
      .string()
      .min(20, "Excerpt must be at least 20 characters")
      .max(300),
    content: z.string().min(50, "Content must be at least 50 characters"),
    categoryId: z.string().min(1, "Select a category"),
    authorId: z.string().min(1, "Select an author"),
    status: z.enum(POST_STATUSES),
    isFeatured: z.boolean(),
    isTrending: z.boolean(),
    scheduledAt: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  })
  .refine((data) => data.status !== "scheduled" || Boolean(data.scheduledAt), {
    message: "Pick a date and time to schedule this post",
    path: ["scheduledAt"],
  });

export type PostFormData = z.infer<typeof postFormSchema>;
