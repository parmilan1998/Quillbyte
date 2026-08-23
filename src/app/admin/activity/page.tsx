"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Activity,
  Filter,
  FileText,
  LogIn,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { activityService } from "@/services/client/activity-service";
import { formatRelativeDate, getInitials } from "@/lib/utils";

const ACTION_ICONS: Record<string, React.ElementType> = {
  published: FileText,
  created: Edit,
  deleted: Trash2,
  updated: Edit,
  login: LogIn,
  viewed: Eye,
};

const ACTION_COLORS: Record<string, string> = {
  published: "bg-success/15 text-success",
  created: "bg-primary/15 text-primary",
  deleted: "bg-danger/15 text-danger",
  updated: "bg-warning/15 text-warning-foreground",
  login: "bg-sky/15 text-sky",
  viewed: "bg-muted text-muted-foreground",
};

export default function AdminActivityPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["admin-activity", search, actionFilter],
    queryFn: () => activityService.getLogs({ search, action: actionFilter }),
  });

  const filtered = logs;

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Activity Logs</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${logs.length} events recorded`}
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search activities…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="h-9 w-36">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
              <SelectItem value="login">Login</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No activity found
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filtered.map((log, idx) => {
              const Icon = ACTION_ICONS[log.action] ?? Activity;
              const colorClass =
                ACTION_COLORS[log.action] ?? ACTION_COLORS.viewed;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="flex items-start gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
                >
                  {/* Action icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* User avatar */}
                  <Avatar size="sm" className="shrink-0">
                    <AvatarImage src={log.user.avatar} alt={log.user.name} />
                    <AvatarFallback>
                      {getInitials(log.user.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">
                        {log.user.name}
                      </span>
                      <Badge
                        className={`text-[10px] capitalize border ${colorClass.replace("text-", "text-")} border-current/20`}
                      >
                        {log.action}
                      </Badge>
                      <span className="text-sm text-muted-foreground capitalize">
                        {log.resource}
                      </span>
                    </div>
                    {log.details && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {log.details}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground/70">
                      <span>{formatRelativeDate(log.createdAt)}</span>
                      {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
