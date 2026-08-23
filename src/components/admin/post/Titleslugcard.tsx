"use client";

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { PostFormData } from "@/types/post-form";

interface TitleSlugCardProps {
  control: Control<PostFormData>;
  register: UseFormRegister<PostFormData>;
  errors: FieldErrors<PostFormData>;
  onTitleChange: (title: string) => void;
}

export function TitleSlugCard({
  control,
  register,
  errors,
  onTitleChange,
}: TitleSlugCardProps) {
  return (
    <div className="bg-card border rounded-2xl p-5 space-y-3">
      <div>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onTitleChange(e.target.value);
              }}
              placeholder="Post title…"
              className="text-2xl font-bold h-auto py-3 px-0 border-0 border-b rounded-none focus-visible:ring-0 placeholder:text-muted-foreground/40 bg-transparent"
            />
          )}
        />
        {errors.title && (
          <p className="text-xs text-danger mt-1">{errors.title.message}</p>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground font-medium shrink-0">
          Slug:
        </span>
        <div className="flex-1 flex items-center gap-1 bg-muted/50 rounded-lg px-2 py-1">
          <span className="text-muted-foreground/60">quillbyte.dev/blog/</span>
          <Input
            {...register("slug")}
            className="h-5 text-xs font-mono text-primary border-0 p-0 focus-visible:ring-0 bg-transparent flex-1"
          />
        </div>
      </div>
      {errors.slug && (
        <p className="text-xs text-danger -mt-1">{errors.slug.message}</p>
      )}
    </div>
  );
}
