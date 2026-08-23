"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { CategoryService } from "@/services/client/category-service";
import { TagService } from "@/services/client/tag-service";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import { postService } from "@/services/client/post-service";
import { useParams, useRouter } from "next/navigation";

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug is required"),
  excerpt: z
    .string()
    .min(20, "Excerpt must be at least 20 characters")
    .max(300),
  content: z.string().min(100, "Content must be at least 100 characters"),
  categoryId: z.string().min(1, "Select a category"),
  status: z.enum(["draft", "published", "scheduled", "archived"]),
  isFeatured: z.boolean(),
  isTrending: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function PostEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!id && id !== "new";

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const { data: existingPost } = useQuery({
    queryKey: ["post-edit", id],
    queryFn: () => postService.getPostById(id!),
    enabled: isEditing,
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
    formState: { errors, isSubmitting },
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

  // react-hook-form only reads `defaultValues` once, at mount — but
  // `existingPost` arrives later, once the query resolves. Without this,
  // the form would render permanently blank when editing an existing post.
  useEffect(() => {
    if (!existingPost) return;
    reset({
      title: existingPost.title,
      slug: existingPost.slug,
      excerpt: existingPost.excerpt,
      content: existingPost.content,
      categoryId: existingPost.category.id,
      status: existingPost.status,
      isFeatured: existingPost.isFeatured,
      isTrending: existingPost.isTrending,
      seoTitle: existingPost.seoTitle,
      seoDescription: existingPost.seoDescription,
    });
    setSelectedTags(existingPost.tags.map((t) => t.id));
  }, [existingPost, reset]);

  const contentValue = watch("content");

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        tagIds: selectedTags,
      };
      if (isEditing) {
        await postService.updatePost(id!, payload);
        toast.success("Post updated successfully!");
      } else {
        await postService.createPost(payload);
        toast.success("Post created successfully!");
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
      router.push("/admin/posts");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const TOOLBAR_ACTIONS = [
    { icon: Bold, label: "Bold", action: () => {} },
    { icon: Italic, label: "Italic", action: () => {} },
    { icon: Hash, label: "Heading", action: () => {} },
    { icon: Quote, label: "Quote", action: () => {} },
    { icon: Code, label: "Code", action: () => {} },
    { icon: List, label: "List", action: () => {} },
    { icon: Link2, label: "Link", action: () => {} },
    { icon: Image, label: "Image", action: () => {} },
    { icon: Minus, label: "Divider", action: () => {} },
  ];

  return (
    <div className="space-y-4 page-enter max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Post" : "New Post"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Create compelling content for your readers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode((v) => !v)}
            className=" cursor-pointer"
          >
            <Eye className="w-4 h-4 mr-1.5" />
            {previewMode ? "Edit" : "Preview"}
          </Button>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-9 w-36">
                  <Globe className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Publish Now</SelectItem>
                  <SelectItem value="scheduled">Schedule</SelectItem>
                  <SelectItem value="archived">Archive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Button
            type="submit"
            form="post-form"
            disabled={isSubmitting}
            className=" cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Saving…" : isEditing ? "Save Changes" : "Publish"}
          </Button>
        </div>
      </div>

      <form id="post-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
          {/* Main editor */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <Input
                {...register("title")}
                placeholder="Post title…"
                className="text-2xl font-bold h-auto py-3 border-0 border-b rounded-none focus-visible:ring-0 px-0 placeholder:text-muted-foreground/50"
                onChange={(e) => {
                  register("title").onChange(e);
                  if (!isEditing) setValue("slug", slugify(e.target.value));
                }}
              />
              {errors.title && (
                <p className="text-xs text-danger mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Slug */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">URL:</span>
              <div className="flex-1 relative">
                <Input
                  {...register("slug")}
                  placeholder="post-slug"
                  className="h-7 text-xs font-mono text-primary"
                />
              </div>
              {errors.slug && (
                <p className="text-xs text-danger">{errors.slug.message}</p>
              )}
            </div>

            {/* Editor Tabs */}
            <Tabs defaultValue="write">
              <div className="flex items-center justify-between border-b pb-2">
                <TabsList className="h-8">
                  <TabsTrigger value="write" className="text-xs h-7">
                    Write
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="text-xs h-7">
                    Preview
                  </TabsTrigger>
                </TabsList>

                {/* Toolbar */}
                <div className="flex items-center gap-0.5">
                  {TOOLBAR_ACTIONS.map(({ icon: Icon, label }) => (
                    <Button
                      key={label}
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 cursor-pointer"
                      title={label}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </Button>
                  ))}
                </div>
              </div>

              <TabsContent value="write">
                <Textarea
                  {...register("content")}
                  placeholder="Write your post content in Markdown…

# Heading 1
## Heading 2

Write your story here. Use **bold**, *italic*, and `code` formatting.

```javascript
// Code blocks are supported
const hello = 'world';
```

> Blockquotes stand out beautifully."
                  className="min-h-96 font-mono text-sm resize-none border-0 focus-visible:ring-0 rounded-none"
                  aria-invalid={!!errors.content}
                />
                {errors.content && (
                  <p className="text-xs text-danger">
                    {errors.content.message}
                  </p>
                )}
              </TabsContent>

              <TabsContent value="preview">
                <div className="blog-prose min-h-96 p-4 border rounded-xl bg-muted/20">
                  {contentValue ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: contentValue.replace(/\n/g, "<br/>"),
                      }}
                    />
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Nothing to preview yet. Start writing!
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea
                {...register("excerpt")}
                placeholder="A brief description of your post (shown in cards and search results)…"
                className="resize-none h-24"
                aria-invalid={!!errors.excerpt}
              />
              {errors.excerpt && (
                <p className="text-xs text-danger">{errors.excerpt.message}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Featured Image */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    PNG, JPG, WebP up to 5MB
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" /> Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={errors.categoryId ? "border-danger" : ""}
                      >
                        <SelectValue placeholder="Select category…" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <span className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full"
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
                {errors.categoryId && (
                  <p className="text-xs text-danger mt-1">
                    {errors.categoryId.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {selectedTags.map((id) => {
                    const tag = allTags.find((t) => t.id === id);
                    return tag ? (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="text-xs gap-1"
                      >
                        #{tag.name}
                        <button
                          onClick={() =>
                            setSelectedTags((p) => p.filter((t) => t !== id))
                          }
                          className=" cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {allTags.filter((t) => !selectedTags.includes(t.id)).map(
                    (tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => setSelectedTags((p) => [...p, tag.id])}
                        className="text-xs px-2 py-0.5 border rounded-full cursor-pointer text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
                      >
                        #{tag.name}
                      </button>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Controller
                  name="isFeatured"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Featured Post</Label>
                        <p className="text-xs text-muted-foreground">
                          Show on homepage
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
                        <Label className="text-sm">Mark as Trending</Label>
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
                  <Label className="text-xs">SEO Title</Label>
                  <Input
                    {...register("seoTitle")}
                    placeholder="Defaults to post title"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">SEO Description</Label>
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
    </div>
  );
}
