"use client";

import { FolderOpen } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_CATEGORIES } from "@/mock/data";
import type { PostFormData } from "@/types/post-form";

interface CategoryCardProps {
  control: Control<PostFormData>;
  categories: typeof MOCK_CATEGORIES;
  error?: string;
}

export function CategoryCard({
  control,
  categories,
  error,
}: CategoryCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-primary" /> Category *
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={error ? "border-danger" : ""}>
                <SelectValue placeholder="Choose category…" />
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
        {error && <p className="text-xs text-danger mt-1">{error}</p>}
      </CardContent>
    </Card>
  );
}
