"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Save,
  Loader2,
  Globe,
  AtSign,
  Code2,
  Shield,
  Bell,
  Palette,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";

const generalSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().optional(),
  description: z.string().optional(),
  contactEmail: z.string().email(),
  postsPerPage: z.number().min(1).max(50),
});

type GeneralForm = z.infer<typeof generalSchema>;

export default function AdminSettingsPage() {
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [requireEmailVerification, setRequireEmailVerification] =
    useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [moderateComments, setModerateComments] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<GeneralForm>({
    // @ts-ignore
    resolver: zodResolver(generalSchema),
    defaultValues: {
      siteName: "Quillbyte",
      tagline: "Ideas that move developers forward",
      description:
        "The modern blog for developers — React, TypeScript, AI, DevOps, and beyond.",
      contactEmail: "hello@quillbyte.dev",
      postsPerPage: 9,
    },
  });

  const onSubmit = async (_data: GeneralForm) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Settings saved successfully!");
  };

  const SETTINGS_TABS = [
    { value: "general", label: "General", icon: Globe },
    { value: "seo", label: "SEO", icon: Search },
    { value: "social", label: "Social", icon: AtSign },
    { value: "security", label: "Security", icon: Shield },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="space-y-5 page-enter max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage site configuration and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="flex flex-col">
        <TabsList className="flex-wrap h-auto gap-1">
          {SETTINGS_TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-1.5">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="mt-5">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">General Settings</CardTitle>
              <CardDescription>
                Basic information about your site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Site Name</Label>
                    <Input {...form.register("siteName")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Contact Email</Label>
                    <Input type="email" {...form.register("contactEmail")} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Tagline</Label>
                  <Input
                    {...form.register("tagline")}
                    placeholder="A short catchy phrase…"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Site Description</Label>
                  <Textarea
                    {...form.register("description")}
                    className="resize-none h-20"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Content Settings</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Allow Registration</Label>
                      <p className="text-xs text-muted-foreground">
                        Let new users create accounts
                      </p>
                    </div>
                    <Switch
                      checked={allowRegistration}
                      onCheckedChange={setAllowRegistration}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">
                        Require Email Verification
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        New users must verify email before posting
                      </p>
                    </div>
                    <Switch
                      checked={requireEmailVerification}
                      onCheckedChange={setRequireEmailVerification}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Allow Comments</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable commenting on articles
                      </p>
                    </div>
                    <Switch
                      checked={allowComments}
                      onCheckedChange={setAllowComments}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Moderate Comments</Label>
                      <p className="text-xs text-muted-foreground">
                        Require approval before comments appear
                      </p>
                    </div>
                    <Switch
                      checked={moderateComments}
                      onCheckedChange={setModerateComments}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={saving}
                    className=" cursor-pointer"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="mt-5">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">SEO Settings</CardTitle>
              <CardDescription>Optimize for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label>Default Meta Title</Label>
                <Input defaultValue="Quillbyte — Ideas worth shipping" />
              </div>
              <div className="space-y-1.5">
                <Label>Default Meta Description</Label>
                <Textarea
                  className="resize-none h-20"
                  defaultValue="In-depth articles on React, TypeScript, AI, DevOps, and modern web development."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Default Keywords</Label>
                <Input defaultValue="react, typescript, javascript, web development, programming" />
              </div>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">
                  Analytics Integrations
                </h3>
                <div className="space-y-1.5">
                  <Label>Google Analytics ID</Label>
                  <Input placeholder="G-XXXXXXXXXX" />
                </div>
                <div className="space-y-1.5">
                  <Label>Google Search Console ID</Label>
                  <Input placeholder="Verification code" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => toast.success("SEO settings saved!")}
                  className=" cursor-pointer"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save SEO Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social */}
        <TabsContent value="social" className="mt-5">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Social Profiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Twitter / X",
                  icon: AtSign,
                  placeholder: "@devpulse",
                  default: "@devpulse",
                },
                {
                  label: "GitHub",
                  icon: Code2,
                  placeholder: "github.com/devpulse",
                  default: "github.com/devpulse",
                },
                {
                  label: "LinkedIn",
                  icon: Globe,
                  placeholder: "linkedin.com/company/devpulse",
                  default: "",
                },
                {
                  label: "YouTube",
                  icon: Globe,
                  placeholder: "youtube.com/@devpulse",
                  default: "",
                },
              ].map(({ label, icon: Icon, placeholder, default: def }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">{label}</Label>
                    <Input placeholder={placeholder} defaultValue={def} />
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => toast.success("Social settings saved!")}
                  className=" cursor-pointer"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-5">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                {
                  label: "Two-Factor Authentication",
                  desc: "Require 2FA for admin accounts",
                  default: false,
                },
                {
                  label: "Login Rate Limiting",
                  desc: "Block IPs after 5 failed attempts",
                  default: true,
                },
                {
                  label: "Content Security Policy",
                  desc: "Enable strict CSP headers",
                  default: true,
                },
                {
                  label: "Force HTTPS",
                  desc: "Redirect all HTTP to HTTPS",
                  default: true,
                },
              ].map(({ label, desc, default: checked }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{label}</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {desc}
                    </p>
                  </div>
                  <Switch defaultChecked={checked} />
                </div>
              ))}
              <Separator />
              <div className="space-y-1.5">
                <Label>Allowed Registration Domains</Label>
                <Input placeholder="e.g. company.com (leave blank for all)" />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of allowed email domains
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-5">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Admin Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "New user registrations",
                  desc: "Email when a new user signs up",
                },
                {
                  label: "New comments",
                  desc: "Email when a new comment needs moderation",
                },
                {
                  label: "Error alerts",
                  desc: "Email when a server error occurs",
                },
                {
                  label: "Weekly digest",
                  desc: "Weekly summary of site metrics",
                },
                {
                  label: "New posts pending review",
                  desc: "Email when author submits for review",
                },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
              <div className="pt-2">
                <Button
                  size="sm"
                  onClick={() =>
                    toast.success("Notification preferences saved!")
                  }
                  className=" cursor-pointer"
                >
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="mt-5">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <Label>Default Theme</Label>
                <div className="flex gap-3">
                  {["Light", "Dark", "System"].map((t) => (
                    <button
                      key={t}
                      className={`flex-1 py-3 rounded-xl cursor-pointer border text-sm font-medium transition-all ${t === "System" ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>Primary Color</Label>
                <div className="flex gap-3 flex-wrap">
                  {[
                    "#2563EB",
                    "#7C3AED",
                    "#0EA5E9",
                    "#22C55E",
                    "#F59E0B",
                    "#EF4444",
                  ].map((c) => (
                    <button
                      key={c}
                      className="w-10 h-10 rounded-xl cursor-pointer border-2 hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: c,
                        borderColor: c === "#2563EB" ? "white" : "transparent",
                        outline: c === "#2563EB" ? `2px solid ${c}` : "none",
                        outlineOffset: 2,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>Border Radius</Label>
                <div className="flex gap-3">
                  {[
                    { label: "None", r: "0" },
                    { label: "Small", r: "0.375rem" },
                    { label: "Medium", r: "0.75rem" },
                    { label: "Large", r: "1rem" },
                  ].map(({ label }) => (
                    <button
                      key={label}
                      className={`flex-1 py-2 border cursor-pointer rounded text-xs font-medium hover:bg-accent transition-colors ${label === "Medium" ? "border-primary bg-primary/5 text-primary" : ""}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => toast.success("Appearance saved!")}
                  className=" cursor-pointer"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Appearance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
