"use client";

import { Calendar } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PostFormData } from "@/types/post-form";

interface ScheduleCardProps {
  register: UseFormRegister<PostFormData>;
  error?: string;
}

export function ScheduleCard({ register, error }: ScheduleCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" /> Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="datetime-local"
          className="text-sm"
          {...register("scheduledAt")}
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          Leave blank to publish immediately. Set a date and the Publish button
          becomes Schedule.
        </p>
        {error && <p className="text-xs text-danger mt-1">{error}</p>}
      </CardContent>
    </Card>
  );
}
