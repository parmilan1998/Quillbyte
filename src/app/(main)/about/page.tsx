"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Users,
  BookOpen,
  Target,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin,
  AtSign,
  Quote,
  Star,
  TrendingUp,
  Globe,
  Mail,
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageBreadcrumb } from "@/components/common/Breadcrumb";
import { MOCK_USERS } from "@/mock/data";
import { getInitials, formatNumber } from "@/lib/utils";
import { SITE } from "@/constants";
import Link from "next/link";

const VALUES = [
  {
    icon: Target,
    title: "Depth over breadth",
    desc: "We go deep on topics that matter to developers. No fluff, no clickbait — just practical knowledge you can use today.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Heart,
    title: "Community first",
    desc: "Every article is written by practitioners sharing hard-won experience. We build for the developer community, not for advertisers.",
    color: "text-danger bg-danger/10",
  },
  {
    icon: Sparkles,
    title: "Always improving",
    desc: "We update articles as technologies evolve. What you read today is accurate, tested, and relevant.",
    color: "text-warning bg-warning/10",
  },
  {
    icon: Shield,
    title: "No paywalls",
    desc: "Every article is free, forever. We believe knowledge should be accessible to every developer regardless of budget.",
    color: "text-success bg-success/10",
  },
  {
    icon: Globe,
    title: "Global perspective",
    desc: "Our authors and readers come from 50+ countries. We celebrate diverse viewpoints and global developer culture.",
    color: "text-sky bg-sky/10",
  },
  {
    icon: TrendingUp,
    title: "Practical focus",
    desc: "Theory is great but application is everything. Every article includes real code, real patterns, and real use cases.",
    color: "text-violet bg-violet/10",
  },
];

const MILESTONES = [
  {
    year: "2022",
    title: "Quillbyte Founded",
    desc: "Launched with 10 articles and a mission to create quality developer content.",
  },
  {
    year: "2023",
    title: "1,000 subscribers",
    desc: "Reached our first major milestone with readers from 20+ countries.",
  },
  {
    year: "2024",
    title: "50+ articles, 5K readers",
    desc: "Expanded to 6 authors and covered 8 major technology categories.",
  },
  {
    year: "2025",
    title: "127 articles, 18K readers",
    desc: "Became one of the most trusted sources for React and TypeScript content.",
  },
];

const TESTIMONIALS = [
  {
    name: "Marcus Chen",
    role: "Staff Engineer at Stripe",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=marcus",
    content:
      "Quillbyte is the only blog I have bookmarked as a must-read. The TypeScript series alone saved me days of research.",
  },
  {
    name: "Layla Hassan",
    role: "Senior Frontend Dev at Figma",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=layla",
    content:
      "The quality of writing here is unmatched. Every article goes from theory to production-ready code. Absolutely essential.",
  },
  {
    name: "Ravi Patel",
    role: "Engineering Manager at Vercel",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ravi",
    content:
      "I share Quillbyte articles with my entire team. It's become part of our team's learning curriculum.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Who writes for Quillbyte?",
    a: "Our authors are experienced software engineers, architects, and developers who actively build production systems. Every author is vetted for expertise in their topic areas.",
  },
  {
    q: "How do you ensure article quality?",
    a: "Every article goes through editorial review, technical fact-checking, and code testing. We only publish content that we'd be confident sharing with our own teams.",
  },
  {
    q: "Can I write for Quillbyte?",
    a: "Yes! We welcome guest contributions from experienced developers. Apply for author access through your account dashboard. We review applications within 3–5 business days.",
  },
  {
    q: "Do you cover beginner topics?",
    a: "We cover all skill levels, but our strength is intermediate to advanced content. For complete beginners, we link to prerequisite resources alongside our articles.",
  },
  {
    q: "How do I stay updated with new content?",
    a: "Subscribe to our newsletter for a curated weekly digest. You can also follow us on social media or use our RSS feed for real-time updates.",
  },
  {
    q: "Is there a paid tier?",
    a: "No. All content on Quillbyte is completely free to read. We're supported by sponsorships from developer-focused companies that align with our values.",
  },
];

export default function AboutPage() {
  const team = MOCK_USERS.filter(
    (u) => u.role === "admin" || u.role === "editor" || u.role === "author",
  );

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="hero-bg border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          <PageBreadcrumb items={[{ label: "About" }]} className="mb-8" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                {SITE.name}
              </span>
            </div>
            <Badge className="mb-5 bg-primary/10 text-primary border-primary/20">
              Est. 2022 · San Francisco & Remote
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Built by developers,{" "}
              <span className="gradient-text">for developers</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              {SITE.name} was created to be the resource we wished existed
              when we were learning — in-depth, accurate, opinionated, and
              written by people who actually ship software.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" asChild className="rounded-xl cursor-pointer">
                <Link href="/blog">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Our Articles
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-xl cursor-pointer"
              >
                <Link href="/auth/register">
                  <Users className="w-4 h-4 mr-2" />
                  Join the Community
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center stagger">
            {[
              {
                value: "127+",
                label: "Articles Published",
                icon: BookOpen,
                color: "text-primary",
              },
              {
                value: "18K+",
                label: "Monthly Readers",
                icon: Users,
                color: "text-violet",
              },
              {
                value: "12",
                label: "Expert Authors",
                icon: Star,
                color: "text-warning",
              },
              {
                value: "4.2K+",
                label: "Newsletter Subscribers",
                icon: Mail,
                color: "text-success",
              },
            ].map(({ value, label, icon: Icon, color }, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={`text-3xl font-bold mb-1 gradient-text`}>
                  {value}
                </div>
                <div
                  className={`flex items-center justify-center gap-1.5 text-sm text-muted-foreground`}
                >
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 text-xs">
              Our Story
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Why we built Quillbyte</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                In 2022, our team of senior engineers got frustrated with the
                state of developer content online. Most tutorials were outdated,
                overly simplistic, or littered with ads and affiliate links.
              </p>
              <p>
                We wanted articles like the ones we'd share internally at work —
                honest assessments of tradeoffs, real production code, and
                advice from engineers who've actually been in the trenches.
              </p>
              <p>
                So we built Quillbyte. A place where the bar is high, the
                content is free, and the focus is always on making you a better
                developer.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {MILESTONES.map((m, idx) => (
              <div key={m.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  {idx < MILESTONES.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2 min-h-6" />
                  )}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs px-2">
                      {m.year}
                    </Badge>
                    <span className="font-semibold text-sm">{m.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Separator />

      {/* Values */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 text-xs">
            Our Values
          </Badge>
          <h2 className="text-3xl font-bold mb-2">What we stand for</h2>
          <p className="text-muted-foreground text-sm">
            Principles that guide everything we publish and build.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {VALUES.map(({ icon: Icon, title, desc, color }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              className="bg-card border rounded-2xl p-6 group hover:border-primary/30 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/30 border-y">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-violet/10 text-violet border-violet/20 text-xs">
              The Team
            </Badge>
            <h2 className="text-3xl font-bold mb-2">Who's behind Quillbyte</h2>
            <p className="text-muted-foreground text-sm">
              Experienced engineers who love writing as much as they love
              building.
            </p>
          </div>

          {/* Core team large cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {team
              .filter((u) => u.role === "admin" || u.role === "editor")
              .map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={`/authors/${member.id}`}
                    className="group flex gap-5 bg-card border rounded-2xl p-6 card-hover"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xl">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      {member.isVerified && (
                        <CheckCircle2 className="absolute -bottom-1 -right-1 w-5 h-5 text-primary fill-background" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                          {member.name}
                        </h3>
                        <Badge className="capitalize border text-[11px] bg-primary/10 text-primary border-primary/20">
                          {member.role}
                        </Badge>
                      </div>
                      {member.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" /> {member.location}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {member.bio}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>
                          <strong className="text-foreground">
                            {member.postCount}
                          </strong>{" "}
                          articles
                        </span>
                        <span>
                          <strong className="text-foreground">
                            {formatNumber(member.followerCount)}
                          </strong>{" "}
                          followers
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>

          {/* Authors smaller grid */}
          {team.filter((u) => u.role === "author").length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                Contributing Authors
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {team
                  .filter((u) => u.role === "author")
                  .map((member, idx) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.07 }}
                    >
                      <Link
                        href={`/authors/${member.id}`}
                        className="group flex flex-col items-center text-center bg-card border rounded-2xl p-5 card-hover"
                      >
                        <Avatar className="w-12 h-12 mb-3 border-2 border-border">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <h4 className="font-semibold text-sm group-hover:text-primary transition-colors leading-tight">
                          {member.name}
                        </h4>
                        {member.location && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {member.location}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {member.postCount} articles
                        </p>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge className="mb-3 bg-success/10 text-success border-success/20 text-xs">
            Readers Love Us
          </Badge>
          <h2 className="text-3xl font-bold mb-2">What developers say</h2>
          <p className="text-muted-foreground text-sm">
            From the engineers who read Quillbyte every week.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border rounded-2xl p-6"
            >
              <Quote className="w-6 h-6 text-primary/25 mb-3" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {t.content}
              </p>
              <Separator className="mb-4" />
              <div className="flex items-center gap-3">
                <Avatar size="sm">
                  <AvatarImage src={t.avatar} />
                  <AvatarFallback>{getInitials(t.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 text-xs">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm">
              Everything you need to know about Quillbyte.
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-card border rounded-xl px-5"
              >
                <AccordionTrigger className="text-sm font-semibold hover:no-underline text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact + CTA */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact card */}
          <div className="bg-card border rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-2">Get in touch</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Have a question, suggestion, or want to collaborate? We'd love to
              hear from you.
            </p>
            <div className="space-y-3">
              {[
                {
                  icon: Mail,
                  label: "General inquiries",
                  value: "hello@quillbyte.dev",
                },
                { icon: Globe, label: "Website", value: "quillbyte.dev" },
                { icon: AtSign, label: "Twitter", value: "@quillbyte" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full mt-6 cursor-pointer"
            >
              <Link href="/contact">
                Send a Message <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Write for us */}
          <div className="bg-linear-to-br from-primary to-violet p-8 rounded-2xl text-white flex flex-col">
            <div className="text-3xl mb-4">✍️</div>
            <h3 className="text-xl font-bold mb-2">Write for Quillbyte</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-6 flex-1">
              Share your expertise with thousands of developers. We welcome
              articles on React, TypeScript, DevOps, AI, and career growth. We
              provide editorial support and promotion.
            </p>
            <div className="space-y-2">
              {[
                "Full editorial support",
                "Promotion to 4K+ subscribers",
                "Author profile & portfolio",
                "Community recognition",
              ].map((perk) => (
                <div
                  key={perk}
                  className="flex items-center gap-2 text-sm text-white/90"
                >
                  <CheckCircle2 className="w-4 h-4 text-white/60 shrink-0" />
                  {perk}
                </div>
              ))}
            </div>
            <Button
              asChild
              variant="secondary"
              className="mt-6 w-full cursor-pointer"
            >
              <Link href="/auth/register">
                Apply Now <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
