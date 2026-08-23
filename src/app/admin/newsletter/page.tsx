"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Plus,
  Search,
  Send,
  Users,
  Eye,
  MousePointer,
  Calendar,
  MoreHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MOCK_CAMPAIGNS,
  MOCK_EMAIL_TEMPLATES,
} from "@/mock/data";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NewsletterService } from "@/services/client/newsletter-service";
import { formatDate, formatNumber } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_BADGE: Record<string, string> = {
  active: "bg-success/15 text-success border-success/20",
  unsubscribed: "bg-muted text-muted-foreground border-border",
  bounced: "bg-danger/15 text-danger border-danger/20",
  sent: "bg-success/15 text-success border-success/20",
  scheduled: "bg-sky/15 text-sky border-sky/20",
  draft: "bg-muted text-muted-foreground border-border",
  failed: "bg-danger/15 text-danger border-danger/20",
};

export default function AdminNewsletterPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [subTab, setSubTab] = useState("subscribers");

  const { data: subscriberData } = useQuery({
    queryKey: ["newsletter-subscribers", search],
    queryFn: () => NewsletterService.getSubscribers({ search, limit: 100 }),
  });
  const filteredSubs = subscriberData?.data ?? [];
  const totalSubscribers = subscriberData?.meta.total ?? 0;
  const activeCount = subscriberData?.activeCount ?? 0;

  const handleRemove = async (id: string) => {
    await NewsletterService.deleteSubscriber(id);
    queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
    toast.success("Subscriber removed");
  };

  const handleExportCsv = () => {
    if (filteredSubs.length === 0) {
      toast.info("No subscribers to export");
      return;
    }
    const rows = [
      ["Email", "Status", "Subscribed At"],
      ...filteredSubs.map((s) => [s.email, s.status, s.subscribedAt]),
    ];
    const csv = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Campaigns aren't real yet — see the note in prisma/schema.prisma. This
  // stat stays derived from mock campaign data until sending is real.
  const openRate =
    MOCK_CAMPAIGNS.filter((c) => c.openRate).reduce(
      (s, c) => s + (c.openRate ?? 0),
      0,
    ) / MOCK_CAMPAIGNS.filter((c) => c.openRate).length;

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Newsletter</h1>
          <p className="text-sm text-muted-foreground">
            Manage subscribers, campaigns, and email templates
          </p>
        </div>
        <Button className=" cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Subscribers",
            value: formatNumber(totalSubscribers),
            icon: Users,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Active",
            value: activeCount,
            icon: Mail,
            color: "text-success",
            bg: "bg-success/10",
          },
          {
            label: "Avg. Open Rate",
            value: `${openRate.toFixed(1)}%`,
            icon: Eye,
            color: "text-violet",
            bg: "bg-violet/10",
          },
          {
            label: "Campaigns Sent",
            value: MOCK_CAMPAIGNS.filter((c) => c.status === "sent").length,
            icon: Send,
            color: "text-warning",
            bg: "bg-warning/10",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg} ${color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {label}
              </p>
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <Tabs value={subTab} onValueChange={setSubTab} className="flex flex-col">
        <TabsList>
          <TabsTrigger value="subscribers">
            Subscribers ({totalSubscribers})
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            Campaigns ({MOCK_CAMPAIGNS.length})
          </TabsTrigger>
          <TabsTrigger value="templates">
            Templates ({MOCK_EMAIL_TEMPLATES.length})
          </TabsTrigger>
        </TabsList>

        {/* Subscribers */}
        <TabsContent value="subscribers" className="mt-4">
          <div className="bg-card border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscribers…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCsv}
                className=" cursor-pointer"
              >
                Export CSV
              </Button>
            </div>
            <div className="divide-y divide-border/60">
              {filteredSubs.map((sub, idx) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors"
                >
                  <Avatar size="sm">
                    <AvatarFallback className="text-xs">
                      {(sub.name ?? sub.email)[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {sub.name ?? "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground">{sub.email}</p>
                  </div>
                  <Badge
                    className={`text-[11px] capitalize border ${STATUS_BADGE[sub.status]}`}
                  >
                    {sub.status}
                  </Badge>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {sub.source ?? "organic"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(sub.subscribedAt, "MMM d, yyyy")}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          toast.info(
                            "Sending emails isn't available yet — no email provider is configured.",
                          )
                        }
                      >
                        <Send className="w-4 h-4" /> Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-danger focus:text-danger"
                        onClick={() => handleRemove(sub.id)}
                      >
                        <X className="w-4 h-4" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Campaigns */}
        <TabsContent value="campaigns" className="mt-4">
          <div className="space-y-4">
            {MOCK_CAMPAIGNS.map((campaign, idx) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-card border rounded-2xl p-5 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-sm">{campaign.name}</h3>
                      <Badge
                        className={`text-[11px] capitalize border ${STATUS_BADGE[campaign.status]}`}
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                      {campaign.subject}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {formatNumber(campaign.recipientCount)} recipients
                      </span>
                      {campaign.openRate && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {campaign.openRate}% open rate
                        </span>
                      )}
                      {campaign.clickRate && (
                        <span className="flex items-center gap-1">
                          <MousePointer className="w-3 h-3" />
                          {campaign.clickRate}% click rate
                        </span>
                      )}
                      {campaign.sentAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Sent {formatDate(campaign.sentAt, "MMM d, yyyy")}
                        </span>
                      )}
                      {campaign.scheduledAt &&
                        campaign.status === "scheduled" && (
                          <span className="flex items-center gap-1 text-sky">
                            <Calendar className="w-3 h-3" />
                            Scheduled{" "}
                            {formatDate(campaign.scheduledAt, "MMM d, yyyy")}
                          </span>
                        )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className=" cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      View
                    </Button>
                    {campaign.status === "draft" && (
                      <Button
                        size="sm"
                        className=" cursor-pointer"
                        onClick={() => toast.success("Campaign sent!")}
                      >
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        Send
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_EMAIL_TEMPLATES.map((template, idx) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-card border rounded-2xl p-5 hover:border-primary/20 transition-all card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-[11px] capitalize">
                    {template.type}
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                  {template.subject}
                </p>
                <p className="text-xs text-muted-foreground">
                  Updated {formatDate(template.updatedAt, "MMM d, yyyy")}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 cursor-pointer"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 cursor-pointer"
                    onClick={() => toast.success("Template duplicated")}
                  >
                    Use
                  </Button>
                </div>
              </motion.div>
            ))}

            {/* Add new template */}
            <button
              className="border-2 border-dashed rounded-2xl p-5 cursor-pointer text-center hover:border-primary/40 transition-colors group"
              onClick={() => toast.info("Template editor coming soon!")}
            >
              <Plus className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2 group-hover:text-primary transition-colors" />
              <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                New Template
              </p>
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
