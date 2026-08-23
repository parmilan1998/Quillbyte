"use client";

import { Image as ImageIcon, Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FeaturedImageCardProps {
  preview: string | null;
  onSelect: (file: File | null) => void;
  onRemove: () => void;
}

const MAX_SIZE_MB = 5;

export function FeaturedImageCard({
  preview,
  onSelect,
  onRemove,
}: FeaturedImageCardProps) {
  const handleFile = (file: File | null) => {
    if (file && file.size > MAX_SIZE_MB * 1024 * 1024) {
      // Keep the card responsible only for its own concern: rejecting an
      // oversized file here rather than in the shared submit handler.
      return;
    }
    onSelect(file);
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-primary" /> Featured Image
        </CardTitle>
      </CardHeader>
      <CardContent>
        {preview ? (
          <div className="relative rounded-xl overflow-hidden border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Featured preview"
              className="w-full h-32 object-cover"
            />
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={onRemove}
              className="absolute top-1.5 right-1.5 h-6 w-6 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        ) : (
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed rounded-xl p-5 text-center hover:border-primary/50 hover:bg-primary/3 transition-all group">
              <Upload className="w-7 h-7 text-muted-foreground/40 mx-auto mb-2 group-hover:text-primary transition-colors" />
              <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                Click to upload
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                PNG, JPG, WebP · max {MAX_SIZE_MB} MB
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </CardContent>
    </Card>
  );
}
