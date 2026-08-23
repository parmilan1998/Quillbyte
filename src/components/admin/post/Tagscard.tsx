"use client";

import { Tag, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_TAGS } from "@/mock/data";

interface TagsCardProps {
  allTags: typeof MOCK_TAGS;
  selectedTagIds: string[];
  onToggle: (tagId: string) => void;
  onRemove: (tagId: string) => void;
}

export function TagsCard({
  allTags,
  selectedTagIds,
  onToggle,
  onRemove,
}: TagsCardProps) {
  const selectedTags = allTags.filter((t) => selectedTagIds.includes(t.id));
  const availableTags = allTags.filter((t) => !selectedTagIds.includes(t.id));

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" /> Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs gap-1 pl-2.5"
              >
                #{tag.name}
                <button
                  type="button"
                  onClick={() => onRemove(tag.id)}
                  className="cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          {availableTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggle(tag.id)}
              className="text-xs px-2 py-0.5 cursor-pointer border rounded-full text-muted-foreground hover:border-primary/50 hover:text-primary transition-all"
            >
              #{tag.name}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
