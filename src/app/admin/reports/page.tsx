"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Flag,
  FileText,
  MessageSquare,
  User as UserIcon,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/EmptyState";
import { ReportService } from "@/services/client/report-service";
import { formatRelativeDate } from "@/lib/utils";
import { toast } from "sonner";
import type { Report } from "@/types";
import Link from "next/link";

const TARGET_ICONS: Record<Report["targetType"], typeof FileText> = {
  post: FileText,
  comment: MessageSquare,
  user: UserIcon,
};

const REASON_LABELS: Record<Report["reason"], string> = {
  spam: "Spam",
  harassment: "Harassment",
  misinformation: "Misinformation",
  copyright: "Copyright",
  inappropriate: "Inappropriate",
  other: "Other",
};

const STATUS_COLORS: Record<Report["status"], string> = {
  pending: "bg-warning/15 text-warning-foreground border-warning/20",
  resolved: "bg-success/15 text-success border-success/20",
  dismissed: "bg-muted text-muted-foreground border-border",
};

function targetHref(report: Report): string | null {
  if (report.targetType === "post") return `/blog/${report.targetId}`;
  if (report.targetType === "user") return `/authors/${report.targetId}`;
  return null;
}

export default function AdminReportsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("pending");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin", "reports", statusFilter],
    queryFn: () => ReportService.getAll({ status: statusFilter }),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });

  const handleResolve = async (id: string) => {
    await ReportService.resolve(id);
    invalidate();
    toast.success("Report resolved");
  };

  const handleDismiss = async (id: string) => {
    await ReportService.dismiss(id);
    invalidate();
    toast.success("Report dismissed");
  };

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading…" : `${reports.length} reports`}
        </p>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      {!isLoading && reports.length === 0 ? (
        <EmptyState
          title="No reports here"
          description={
            statusFilter === "pending"
              ? "Nothing needs review right now."
              : "No reports match this filter."
          }
          icon={<Flag className="w-8 h-8 text-muted-foreground/40" />}
        />
      ) : (
        <div className="bg-card border rounded-2xl divide-y divide-border/60">
          {reports.map((report, idx) => {
            const Icon = TARGET_ICONS[report.targetType];
            const href = targetHref(report);
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="p-4 flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-[10px] capitalize">
                      {report.targetType}
                    </Badge>
                    <Badge className={`text-[10px] border ${STATUS_COLORS[report.status]}`}>
                      {report.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Reason: {REASON_LABELS[report.reason]}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-1.5 line-clamp-1">
                    {report.targetLabel}
                  </p>
                  {report.details && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      "{report.details}"
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>Reported by {report.reporter.name}</span>
                    <span>{formatRelativeDate(report.createdAt)}</span>
                    {href && (
                      <Link
                        href={href}
                        target="_blank"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" /> View
                      </Link>
                    )}
                  </div>
                </div>
                {report.status === "pending" && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs cursor-pointer"
                      onClick={() => handleResolve(report.id)}
                    >
                      <Check className="w-3 h-3 mr-1" /> Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs cursor-pointer text-muted-foreground"
                      onClick={() => handleDismiss(report.id)}
                    >
                      <X className="w-3 h-3 mr-1" /> Dismiss
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
