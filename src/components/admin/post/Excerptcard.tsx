"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PostFormData } from "@/types/post-form";

interface ExcerptCardProps {
  register: UseFormRegister<PostFormData>;
  errors: FieldErrors<PostFormData>;
}

export function ExcerptCard({ register, errors }: ExcerptCardProps) {
  return (
    <div className="bg-card border rounded-2xl p-5 space-y-2">
      <Label className="font-semibold">
        Excerpt
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          (shown in card previews)
        </span>
      </Label>
      <Textarea
        {...register("excerpt")}
        placeholder="Brief description of the post…"
        className="resize-none h-20 text-sm"
      />
      {errors.excerpt && (
        <p className="text-xs text-danger">{errors.excerpt.message}</p>
      )}
    </div>
  );
}
