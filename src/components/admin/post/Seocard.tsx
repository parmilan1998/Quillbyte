"use client";

import type { UseFormRegister } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PostFormData } from "@/types/post-form";

interface SeoCardProps {
  register: UseFormRegister<PostFormData>;
}

export function SeoCard({ register }: SeoCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">SEO</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">SEO Title</Label>
          <Input
            {...register("seoTitle")}
            placeholder="Defaults to post title"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            Meta Description
          </Label>
          <Textarea
            {...register("seoDescription")}
            placeholder="Defaults to excerpt"
            className="resize-none h-16 text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
