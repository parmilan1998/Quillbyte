"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Save,
  Eye,
  Globe,
  Loader2,
  Upload,
  Tag,
  FolderOpen,
  Settings,
  X,
  Image,
  Bold,
  Italic,
  Code,
  List,
  Link2,
  Hash,
  Quote,
  Minus,
  ArrowLeft,
  Edit3,
  Clock,
  AlertCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CategoryService } from "@/services/client/category-service";
import { TagService } from "@/services/client/tag-service";
import {
  estimateReadingTime,
  formatDate,
  formatRelativeDate,
} from "@/lib/utils";
import { toast } from "sonner";
import { PageBreadcrumb } from "@/components/common/Breadcrumb";
import type { PostStatus } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { postService } from "@/services/client/post-service";
import Link from "next/link";

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug is required"),
  excerpt: z
    .string()
    .min(20, "Excerpt must be at least 20 characters")
    .max(300),
  content: z.string().min(50, "Content must be at least 50 characters"),
  categoryId: z.string().min(1, "Select a category"),
  status: z.enum(["draft", "published", "scheduled", "archived"]),
  isFeatured: z.boolean(),
  isTrending: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const TOOLBAR = [
  { icon: Bold, label: "Bold", insert: "**bold**" },
  { icon: Italic, label: "Italic", insert: "*italic*" },
  { icon: Hash, label: "Heading", insert: "\n## Heading\n" },
  { icon: Quote, label: "Quote", insert: "\n> Blockquote\n" },
  { icon: Code, label: "Code", insert: "`code`" },
  { icon: List, label: "List", insert: "\n- Item\n- Item\n" },
  { icon: Link2, label: "Link", insert: "[text](url)" },
  { icon: Image, label: "Image", insert: "![alt](url)" },
  { icon: Minus, label: "Divider", insert: "\n---\n" },
];

const STATUS_BADGE: Record<PostStatus, string> = {
  published: "bg-success/15 text-success border-success/20",
  draft: "bg-warning/15 text-warning-foreground border-warning/20",
  scheduled: "bg-sky/15 text-sky border-sky/20",
  archived: "bg-muted text-muted-foreground border-border",
};

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post-edit", id],
    queryFn: () => postService.getPostById(id!),
    enabled: !!id,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAll(),
  });
  const { data: allTags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => TagService.getAll(),
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    // @ts-ignore
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      categoryId: "",
      status: "draft",
      isFeatured: false,
      isTrending: false,
    },
  });

  // Populate form once post loads
  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        categoryId: post.category.id,
        status: post.status,
        isFeatured: post.isFeatured,
        isTrending: post.isTrending,
        seoTitle: post.seoTitle ?? "",
        seoDescription: post.seoDescription ?? "",
      });
      setSelectedTags(post.tags.map((t) => t.id));
      setWordCount(post.content.trim().split(/\s+/).filter(Boolean).length);
    }
  }, [post, reset]);

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  const contentValue = watch("content");

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue("content", e.target.value, { shouldDirty: true });
    setWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length);
  };

  const insertMarkdown = (text: string) => {
    const el = document.getElementById("edit-content") as HTMLTextAreaElement;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const updated = el.value.slice(0, start) + text + el.value.slice(end);
    setValue("content", updated, { shouldDirty: true });
    el.focus();
    setTimeout(
      () => el.setSelectionRange(start + text.length, start + text.length),
      0,
    );
  };

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    try {
      const payload = {
        ...data,
        tagIds: selectedTags,
      };
      const result = await postService.updatePost(id, payload);
      if (result.success) {
        setHasUnsavedChanges(false);
        queryClient.invalidateQueries({ queryKey: ["post-edit", id] });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Post updated successfully!");
      } else {
        toast.error(
          result.message ?? "Something went wrong. Please try again.",
        );
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    await postService.deletePost(id);
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    toast.success("Post deleted");
    router.push("/dashboard/posts");
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-5 max-w-6xl">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-72" />
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4 opacity-60" />
        <h2 className="text-xl font-bold mb-2">Post not found</h2>
        <p className="text-muted-foreground text-sm mb-6">
          This post doesn't exist or you don't have permission to edit it.
        </p>
        <Button asChild className="cursor-pointer">
          <Link href="/dashboard/posts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5 max-w-6xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <PageBreadcrumb
              items={[
                { label: "My Posts", href: "/dashboard/posts" },
                { label: "Edit Post" },
              ]}
              className="mb-2"
            />
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-warning/15 flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-warning-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Edit Post</h1>
              <Badge
                className={`text-[11px] capitalize border ${STATUS_BADGE[post.status]}`}
              >
                {post.status}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last updated {formatRelativeDate(post.updatedAt)}
              </span>
              {post.publishedAt && (
                <span>
                  Published {formatDate(post.publishedAt, "MMM d, yyyy")}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {post.status === "published" && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className=" cursor-pointer"
              >
                <Link href={`/blog/${post.slug}`} target="_blank">
                  <Eye className="w-4 h-4 mr-1.5" />
                  View Live
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-danger border-danger/30 hover:bg-danger/5 hover:text-danger cursor-pointer"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete
            </Button>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9 w-36 text-sm">
                    <Globe className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSubmitting ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Unsaved changes notice */}
        {hasUnsavedChanges && (
          <Alert className="border-warning/40 bg-warning/8">
            <AlertCircle className="h-4 w-4 text-warning-foreground" />
            <AlertDescription className="text-sm text-warning-foreground">
              You have unsaved changes. Remember to save before leaving.
            </AlertDescription>
          </Alert>
        )}

        <form id="edit-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
            {/* ── Main Editor ────────────────────────────────────── */}
            <div className="space-y-4">
              {/* Title + Slug */}
              <div className="bg-card border rounded-2xl p-5 space-y-3">
                <div>
                  <Input
                    {...register("title")}
                    onChange={(e) => {
                      setValue("title", e.target.value, { shouldDirty: true });
                    }}
                    placeholder="Post title…"
                    className="text-2xl font-bold h-auto py-3 px-0 border-0 border-b rounded-none focus-visible:ring-0 placeholder:text-muted-foreground/40 bg-transparent"
                    aria-label="Post title"
                  />
                  {errors.title && (
                    <p className="text-xs text-danger mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-medium shrink-0">
                    URL slug:
                  </span>
                  <div className="flex-1 flex items-center gap-1 bg-muted/50 rounded-lg px-2 py-1">
                    <span className="text-muted-foreground/60">
                      quillbyte.dev/blog/
                    </span>
                    <Input
                      {...register("slug")}
                      className="h-5 text-xs font-mono text-primary border-0 p-0 focus-visible:ring-0 bg-transparent flex-1"
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-danger">{errors.slug.message}</p>
                  )}
                </div>
              </div>

              {/* Editor */}
              <div className="bg-card border rounded-2xl overflow-hidden">
                <Tabs defaultValue="write">
                  <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/30">
                    <TabsList className="h-7 bg-transparent p-0 gap-1">
                      <TabsTrigger value="write" className="h-7 px-3 text-xs">
                        ✏️ Write
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="h-7 px-3 text-xs">
                        👁 Preview
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-0.5">
                      {TOOLBAR.map(({ icon: Icon, label, insert }) => (
                        <Tooltip key={label}>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 cursor-pointer"
                              onClick={() => insertMarkdown(insert)}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="text-xs">
                            {label}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{wordCount} words</span>
                      <span>
                        ~{estimateReadingTime(contentValue || "")} min read
                      </span>
                    </div>
                  </div>

                  <TabsContent value="write" className="m-0">
                    <Textarea
                      id="edit-content"
                      {...register("content")}
                      onChange={handleContentChange}
                      className="min-h-125 font-mono text-sm resize-none border-0 rounded-none focus-visible:ring-0 p-5 leading-relaxed"
                      aria-label="Post content"
                      aria-invalid={!!errors.content}
                    />
                    {errors.content && (
                      <p className="text-xs text-danger px-5 pb-3">
                        {errors.content.message}
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="preview" className="m-0">
                    <div className="min-h-125 p-5 blog-prose">
                      {contentValue ? (
                        contentValue.split("\n").map((line, idx) => {
                          if (line.startsWith("# "))
                            return <h1 key={idx}>{line.slice(2)}</h1>;
                          if (line.startsWith("## "))
                            return <h2 key={idx}>{line.slice(3)}</h2>;
                          if (line.startsWith("### "))
                            return <h3 key={idx}>{line.slice(4)}</h3>;
                          if (line.startsWith("> "))
                            return (
                              <blockquote key={idx}>{line.slice(2)}</blockquote>
                            );
                          if (line.startsWith("- "))
                            return <li key={idx}>{line.slice(2)}</li>;
                          if (line.trim() === "") return <br key={idx} />;
                          return <p key={idx}>{line}</p>;
                        })
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Nothing to preview.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Excerpt */}
              <div className="bg-card border rounded-2xl p-5 space-y-2">
                <Label className="font-semibold">
                  Excerpt
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    (shown in card previews)
                  </span>
                </Label>
                <Textarea
                  {...register("excerpt")}
                  className="resize-none h-20 text-sm"
                  aria-invalid={!!errors.excerpt}
                />
                <div className="flex items-center justify-between">
                  {errors.excerpt ? (
                    <p className="text-xs text-danger">
                      {errors.excerpt.message}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {watch("excerpt")?.length ?? 0}/300 characters
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right Sidebar ──────────────────────────────────── */}
            <div className="space-y-4">
              {/* Post stats (edit-specific) */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Post Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    {[
                      {
                        label: "Views",
                        value: post.viewCount.toLocaleString(),
                      },
                      { label: "Likes", value: post.likeCount },
                      { label: "Comments", value: post.commentCount },
                      { label: "Bookmarks", value: post.bookmarkCount },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-muted/40 rounded-xl p-2.5">
                        <p className="text-base font-bold">{value}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Image className="w-4 h-4 text-primary" />
                    Featured Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {post.featuredImage ? (
                    <div className="relative group rounded-xl overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt="Featured"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-xs h-7 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Replace
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/50 hover:bg-primary/3 transition-all group">
                        <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2 group-hover:text-primary transition-colors" />
                        <p className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                          Click to upload
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                          PNG, JPG, WebP · max 5 MB
                        </p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  )}
                </CardContent>
              </Card>

              {/* Category */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-primary" />
                    Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={errors.categoryId ? "border-danger" : ""}
                        >
                          <SelectValue placeholder="Choose a category…" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              <span className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ backgroundColor: cat.color }}
                                />
                                {cat.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTags.map((tid) => {
                        const tag = allTags.find((t) => t.id === tid);
                        return tag ? (
                          <Badge
                            key={tid}
                            variant="secondary"
                            className="text-xs gap-1 pl-2.5"
                          >
                            #{tag.name}
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedTags((p) =>
                                  p.filter((t) => t !== tid),
                                )
                              }
                              className="hover:text-danger transition-colors cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {allTags
                      .filter((t) => !selectedTags.includes(t.id))
                      .map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => setSelectedTags((p) => [...p, tag.id])}
                          className="text-xs px-2.5 py-1 border rounded-full text-muted-foreground cursor-pointer hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
                        >
                          #{tag.name}
                        </button>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Options */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" />
                    Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm cursor-pointer">
                            Featured Post
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Show on homepage hero
                          </p>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                  <Separator />
                  <Controller
                    name="isTrending"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm cursor-pointer">
                            Trending
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Boost visibility
                          </p>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                </CardContent>
              </Card>

              {/* SEO */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      SEO Title
                    </Label>
                    <Input
                      {...register("seoTitle")}
                      placeholder="Defaults to post title"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      SEO Description
                    </Label>
                    <Textarea
                      {...register("seoDescription")}
                      placeholder="Defaults to excerpt"
                      className="resize-none h-20 text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>"{post.title}"</strong>?
                This action cannot be undone. All comments, likes, and bookmarks
                will also be removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Post</AlertDialogCancel>
              <AlertDialogAction
                className="bg-danger hover:bg-danger/90"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </TooltipProvider>
  );
}
