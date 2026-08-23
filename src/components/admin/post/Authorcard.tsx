"use client";

import { User } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { MOCK_USERS } from "@/mock/data";
import type { PostFormData } from "@/types/post-form";

interface AuthorCardProps {
  control: Control<PostFormData>;
  authors: typeof MOCK_USERS;
}

export function AuthorCard({ control, authors }: AuthorCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> Author
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Controller
          name="authorId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select author…" />
              </SelectTrigger>
              <SelectContent>
                {authors.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    <span className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarImage src={author.avatar} />
                        <AvatarFallback>
                          {getInitials(author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{author.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </CardContent>
    </Card>
  );
}
