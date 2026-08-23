"use client";

import { Settings } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { PostFormData } from "@/types/post-form";

interface OptionsCardProps {
  control: Control<PostFormData>;
}

export function OptionsCard({ control }: OptionsCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" /> Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Controller
          name="isFeatured"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Featured</Label>
                <p className="text-xs text-muted-foreground">Homepage hero</p>
              </div>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                <Label className="text-sm">Trending</Label>
                <p className="text-xs text-muted-foreground">Boost feeds</p>
              </div>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}
