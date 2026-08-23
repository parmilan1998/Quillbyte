"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/common/Breadcrumb";

interface PostFormHeaderProps {
  isSubmitting: boolean;
  isScheduled: boolean;
  wordCount: number;
  readingTime: number;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function PostFormHeader({
  isSubmitting,
  isScheduled,
  wordCount,
  readingTime,
  onSaveDraft,
  onPublish,
}: PostFormHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <PageBreadcrumb
          items={[
            { label: "Posts", href: "/admin/posts" },
            { label: "New Post" },
          ]}
          className="mb-2"
        />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
            <Plus className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Create New Post</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          Admin · Full publishing control
          {wordCount > 0 && ` · ${wordCount} words · ${readingTime} min read`}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="sm" asChild className="cursor-pointer">
          <Link href="/admin/posts">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Cancel
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          <Save className="w-4 h-4 mr-1.5" /> Save Draft
        </Button>
        <Button
          type="button"
          onClick={onPublish}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          {isSubmitting
            ? isScheduled
              ? "Scheduling…"
              : "Publishing…"
            : isScheduled
              ? "Schedule"
              : "Publish"}
        </Button>
      </div>
    </div>
  );
}
