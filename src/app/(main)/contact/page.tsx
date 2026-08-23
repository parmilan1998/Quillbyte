"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  AtSign,
  Code2,
  Send,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import { PageBreadcrumb } from "@/components/common/Breadcrumb";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // @ts-ignore
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="page-enter">
      <section className="hero-bg border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-14">
          <PageBreadcrumb items={[{ label: "Contact" }]} className="mb-10" />
          <p className="text-xs uppercase tracking-[0.18em] text-primary font-bold mb-3">
            Start a conversation
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Contact Quillbyte
          </h1>
          <p className="text-muted-foreground max-w-xl leading-relaxed">
            Have a question, suggestion, or want to contribute? We'd love to
            hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
          {/* Info */}
          <div className="space-y-8 lg:pt-4">
            <div>
              <h2 className="text-xl font-bold mb-4">Get in touch</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Whether you have a question about the platform, want to pitch an
                article idea, or just want to say hello — our inbox is always
                open.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "hello@quillbyte.dev",
                  href: "mailto:hello@quillbyte.dev",
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: "Remote-first team, worldwide",
                  href: null,
                },
                {
                  icon: AtSign,
                  label: "Twitter",
                  value: "@quillbyte",
                  href: "https://twitter.com/quillbyte",
                },
                {
                  icon: Code2,
                  label: "GitHub",
                  value: "github.com/quillbyte",
                  href: "https://github.com/quillbyte",
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-muted/50 rounded-2xl p-5">
              <h3 className="font-semibold text-sm mb-2">Response Time</h3>
              <p className="text-xs text-muted-foreground">
                We typically respond within 24–48 hours on business days. For
                urgent issues, include "URGENT" in your subject line.
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border rounded-2xl p-8 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-lg font-bold mb-2">Message sent!</h3>
                <p className="text-sm text-muted-foreground">
                  Thanks for reaching out. We'll get back to you within 24–48
                  hours.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-card border rounded-2xl p-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Name</Label>
                    <Input
                      {...register("name")}
                      placeholder="Your Name"
                      className={errors.name ? "border-danger" : ""}
                    />
                    {errors.name && (
                      <p className="text-xs text-danger">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="you@example.com"
                      className={errors.email ? "border-danger" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-danger">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Subject</Label>
                  <Controller
                    name="subject"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={errors.subject ? "border-danger" : ""}
                        >
                          <SelectValue placeholder="Choose a topic…" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            General Question
                          </SelectItem>
                          <SelectItem value="article">
                            Article Suggestion
                          </SelectItem>
                          <SelectItem value="contribute">
                            Contribute / Write for Us
                          </SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="partnership">
                            Partnership
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Message</Label>
                  <Textarea
                    {...register("message")}
                    placeholder="Tell us what's on your mind…"
                    className={`resize-none h-28 ${errors.message ? "border-danger" : ""}`}
                  />
                  {errors.message && (
                    <p className="text-xs text-danger">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isSubmitting ? "Sending…" : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
