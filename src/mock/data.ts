import type {
  User,
  Category,
  Tag,
  Post,
  Comment,
  Notification,
  MediaFile,
  Subscriber,
  AnalyticsSummary,
  AnalyticsDataPoint,
  TopPost,
  TrafficSource,
  DeviceStats,
  ActivityLog,
  Campaign,
  EmailTemplate,
} from "../types";

// â”€â”€â”€ Users â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Alex Carter",
    email: "alex@devpulse.io",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=alex",
    bio: "Senior Software Engineer & Tech Writer. Passionate about React, TypeScript, and building great developer experiences.",
    role: "admin",
    status: "active",
    website: "https://alexcarter.dev",
    location: "San Francisco, CA",
    twitterHandle: "alexcarter",
    githubHandle: "alexcarter",
    linkedinHandle: "alexcarter",
    postCount: 47,
    followerCount: 12400,
    followingCount: 340,
    isVerified: true,
    createdAt: "2022-01-10T09:00:00Z",
    updatedAt: "2025-06-01T10:00:00Z",
    lastLoginAt: "2025-06-20T08:30:00Z",
  },
  {
    id: "u2",
    name: "Mia Tanaka",
    email: "mia@devpulse.io",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=mia",
    bio: "UI/UX Designer & Frontend Developer. I love crafting beautiful, accessible interfaces with Tailwind CSS and Figma.",
    role: "editor",
    status: "active",
    location: "Tokyo, Japan",
    twitterHandle: "miatanaka",
    githubHandle: "miatanaka",
    postCount: 31,
    followerCount: 8700,
    followingCount: 210,
    isVerified: true,
    createdAt: "2022-03-15T09:00:00Z",
    updatedAt: "2025-05-20T10:00:00Z",
    lastLoginAt: "2025-06-19T14:00:00Z",
  },
  {
    id: "u3",
    name: "Devon Blake",
    email: "devon@devpulse.io",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=devon",
    bio: "DevOps Engineer & Cloud Architect. I write about Kubernetes, CI/CD, and cloud-native development.",
    role: "author",
    status: "active",
    location: "Berlin, Germany",
    twitterHandle: "devonblake",
    githubHandle: "devonblake",
    postCount: 22,
    followerCount: 5300,
    followingCount: 180,
    isVerified: true,
    createdAt: "2022-06-01T09:00:00Z",
    updatedAt: "2025-04-10T10:00:00Z",
    lastLoginAt: "2025-06-18T11:00:00Z",
  },
  {
    id: "u4",
    name: "Priya Singh",
    email: "priya@devpulse.io",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=priya",
    bio: "ML Engineer & AI Researcher. Exploring the intersection of LLMs and developer productivity.",
    role: "author",
    status: "active",
    location: "Bangalore, India",
    twitterHandle: "priyasingh",
    githubHandle: "priyasingh",
    postCount: 18,
    followerCount: 9200,
    followingCount: 290,
    isVerified: true,
    createdAt: "2022-09-01T09:00:00Z",
    updatedAt: "2025-03-15T10:00:00Z",
    lastLoginAt: "2025-06-17T16:00:00Z",
  },
  {
    id: "u5",
    name: "Jordan Kim",
    email: "jordan@example.com",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=jordan",
    bio: "Fullstack developer learning in public.",
    role: "user",
    status: "active",
    postCount: 0,
    followerCount: 320,
    followingCount: 112,
    isVerified: false,
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2025-06-10T10:00:00Z",
    lastLoginAt: "2025-06-20T07:00:00Z",
  },
  {
    id: "u6",
    name: "Riley Morgan",
    email: "riley@example.com",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=riley",
    bio: "React enthusiast and CSS artist.",
    role: "user",
    status: "suspended",
    postCount: 0,
    followerCount: 45,
    followingCount: 88,
    isVerified: false,
    createdAt: "2024-03-10T09:00:00Z",
    updatedAt: "2025-06-01T10:00:00Z",
  },
  {
    id: "u7",
    name: "Sam Rivera",
    email: "sam@example.com",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=sam",
    bio: "Software engineer at a fintech startup.",
    role: "user",
    status: "active",
    postCount: 0,
    followerCount: 178,
    followingCount: 234,
    isVerified: true,
    createdAt: "2023-11-05T09:00:00Z",
    updatedAt: "2025-05-30T10:00:00Z",
    lastLoginAt: "2025-06-15T09:00:00Z",
  },
  {
    id: "u8",
    name: "Taylor Wu",
    email: "taylor@example.com",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=taylor",
    bio: "Backend developer specializing in Go and distributed systems.",
    role: "author",
    status: "active",
    postCount: 9,
    followerCount: 2300,
    followingCount: 145,
    isVerified: true,
    createdAt: "2023-05-20T09:00:00Z",
    updatedAt: "2025-04-20T10:00:00Z",
    lastLoginAt: "2025-06-12T13:00:00Z",
  },
];

// â”€â”€â”€ Categories â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "c1",
    name: "React",
    slug: "react",
    description: "React hooks, patterns, and performance",
    color: "#61DAFB",
    postCount: 24,
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "c2",
    name: "TypeScript",
    slug: "typescript",
    description: "Type safety, advanced patterns",
    color: "#3178C6",
    postCount: 19,
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "c3",
    name: "Design",
    slug: "design",
    description: "UI/UX, design systems, Figma",
    color: "#FF6B6B",
    postCount: 15,
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "c4",
    name: "DevOps",
    slug: "devops",
    description: "Docker, Kubernetes, CI/CD pipelines",
    color: "#4ECDC4",
    postCount: 12,
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "c5",
    name: "AI & ML",
    slug: "ai-ml",
    description: "LLMs, machine learning, prompt engineering",
    color: "#A78BFA",
    postCount: 18,
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "c6",
    name: "CSS",
    slug: "css",
    description: "Modern CSS, animations, Tailwind",
    color: "#F59E0B",
    postCount: 11,
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "c7",
    name: "Node.js",
    slug: "nodejs",
    description: "Server-side JS, REST APIs, GraphQL",
    color: "#68D391",
    postCount: 10,
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "c8",
    name: "Career",
    slug: "career",
    description: "Career growth, interviews, soft skills",
    color: "#FCA5A5",
    postCount: 9,
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
];

// â”€â”€â”€ Tags â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_TAGS: Tag[] = [
  {
    id: "t1",
    name: "react",
    slug: "react",
    color: "#61dafb",
    postCount: 24,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t2",
    name: "typescript",
    slug: "typescript",
    color: "#3178c6",
    postCount: 19,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t3",
    name: "nextjs",
    slug: "nextjs",
    color: "#000000",
    postCount: 16,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t4",
    name: "tailwindcss",
    slug: "tailwindcss",
    color: "#38bdf8",
    postCount: 13,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t5",
    name: "javascript",
    slug: "javascript",
    color: "#f7df1e",
    postCount: 28,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t6",
    name: "css",
    slug: "css",
    color: "#264de4",
    postCount: 11,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t7",
    name: "performance",
    slug: "performance",
    color: "#10b981",
    postCount: 9,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t8",
    name: "accessibility",
    slug: "accessibility",
    color: "#8b5cf6",
    postCount: 7,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t9",
    name: "testing",
    slug: "testing",
    color: "#f59e0b",
    postCount: 8,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t10",
    name: "docker",
    slug: "docker",
    color: "#2496ed",
    postCount: 6,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t11",
    name: "ai",
    slug: "ai",
    color: "#a855f7",
    postCount: 14,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t12",
    name: "design-systems",
    slug: "design-systems",
    color: "#ec4899",
    postCount: 8,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t13",
    name: "api",
    slug: "api",
    color: "#059669",
    postCount: 11,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t14",
    name: "hooks",
    slug: "hooks",
    color: "#6366f1",
    postCount: 12,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t15",
    name: "state-management",
    slug: "state-management",
    color: "#f97316",
    postCount: 10,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t16",
    name: "kubernetes",
    slug: "kubernetes",
    color: "#326ce5",
    postCount: 7,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t17",
    name: "graphql",
    slug: "graphql",
    color: "#e535ab",
    postCount: 6,
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "t18",
    name: "security",
    slug: "security",
    color: "#dc2626",
    postCount: 5,
    createdAt: "2022-01-01T00:00:00Z",
  },
];

// â”€â”€â”€ Posts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    title: "Building Modern React Apps with TypeScript and Vite in 2025",
    slug: "building-modern-react-apps-typescript-vite-2025",
    excerpt:
      "Explore the latest patterns and best practices for building production-ready React applications with TypeScript, Vite, and the modern JS ecosystem.",
    content: `# Building Modern React Apps with TypeScript and Vite in 2025

The React ecosystem continues to evolve at a rapid pace. In this comprehensive guide, we'll walk through everything you need to build a production-ready application using the latest tools.

## Why Vite?

Vite has revolutionized the development experience for React applications. With its lightning-fast HMR and optimized build pipeline, it's become the de-facto choice for modern React development.

\`\`\`typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
\`\`\`

## Setting Up TypeScript Properly

Good TypeScript configuration is essential for a great developer experience.

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true
  }
}
\`\`\`

## Component Architecture

Building scalable components requires careful architecture decisions.

### Feature-Based Structure

Organize your code by features, not file types:

\`\`\`
src/
â”œâ”€â”€ features/
â”‚   â”œâ”€â”€ auth/
â”‚   â”œâ”€â”€ dashboard/
â”‚   â””â”€â”€ settings/
â”œâ”€â”€ shared/
â”‚   â”œâ”€â”€ components/
â”‚   â””â”€â”€ hooks/
â””â”€â”€ lib/
\`\`\`

## State Management with TanStack Query

TanStack Query is perfect for server state management.

\`\`\`typescript
import { useQuery } from '@tanstack/react-query'

function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  })
}
\`\`\`

> **Pro tip:** Use \`staleTime\` wisely to avoid unnecessary refetches and improve perceived performance.

## Conclusion

Building modern React applications in 2025 is an exciting journey. The tooling has never been better.`,
    featuredImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&q=80",
    status: "published",
    author: MOCK_USERS[0],
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_TAGS[0], MOCK_TAGS[1], MOCK_TAGS[2]],
    publishedAt: "2025-06-10T10:00:00Z",
    createdAt: "2025-06-08T10:00:00Z",
    updatedAt: "2025-06-10T10:00:00Z",
    readingTime: 8,
    viewCount: 14520,
    likeCount: 412,
    commentCount: 38,
    bookmarkCount: 195,
    isFeatured: true,
    isTrending: true,
    seoTitle: "Building Modern React Apps with TypeScript and Vite 2025",
    seoDescription: "Complete guide to building production-ready React apps.",
  },
  {
    id: "p2",
    title: "Mastering Tailwind CSS v4: The Complete Developer Guide",
    slug: "mastering-tailwind-css-v4-complete-guide",
    excerpt:
      "Tailwind CSS v4 brings OKLCH colors, a new CSS-first configuration system, and a dramatically faster engine. Here's everything you need to upgrade.",
    content: `# Mastering Tailwind CSS v4

Tailwind CSS v4 is a ground-up rewrite that delivers incredible performance improvements and a simplified developer experience.

## The New CSS-First Configuration

One of the biggest shifts is moving from \`tailwind.config.js\` to CSS-based configuration.

\`\`\`css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", sans-serif;
  --color-primary: oklch(0.5 0.2 264);
  --radius-lg: 0.75rem;
}
\`\`\`

## OKLCH Colors

Tailwind v4 embraces OKLCH for perceptually uniform, wide-gamut colors.

## Performance

The new oxide engine is up to **10x faster** than v3 for cold starts.`,
    featuredImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80",
    status: "published",
    author: MOCK_USERS[1],
    category: MOCK_CATEGORIES[5],
    tags: [MOCK_TAGS[3], MOCK_TAGS[5]],
    publishedAt: "2025-06-05T09:00:00Z",
    createdAt: "2025-06-03T09:00:00Z",
    updatedAt: "2025-06-05T09:00:00Z",
    readingTime: 7,
    viewCount: 10230,
    likeCount: 298,
    commentCount: 25,
    bookmarkCount: 142,
    isFeatured: true,
    isTrending: false,
    seoTitle: "Mastering Tailwind CSS v4 - Complete Guide",
    seoDescription: "Learn Tailwind CSS v4 from scratch.",
  },
  {
    id: "p3",
    title: "Advanced TypeScript Patterns Every Senior Dev Should Know",
    slug: "advanced-typescript-patterns-senior-dev",
    excerpt:
      "Deep dive into conditional types, mapped types, template literal types, and infer â€” real-world patterns that make TypeScript truly powerful.",
    content: `# Advanced TypeScript Patterns

Let's explore the TypeScript features that separate good code from great code.

## Conditional Types

\`\`\`typescript
type IsArray<T> = T extends Array<infer Item> ? Item : never;

type NumberItems = IsArray<number[]>; // number
\`\`\`

## Mapped Types

\`\`\`typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
\`\`\`

## Template Literal Types

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type ClickEvent = EventName<'click'>; // "onClick"
\`\`\``,
    featuredImage:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=900&q=80",
    status: "published",
    author: MOCK_USERS[0],
    category: MOCK_CATEGORIES[1],
    tags: [MOCK_TAGS[1], MOCK_TAGS[4]],
    publishedAt: "2025-06-01T11:00:00Z",
    createdAt: "2025-05-30T11:00:00Z",
    updatedAt: "2025-06-01T11:00:00Z",
    readingTime: 11,
    viewCount: 8750,
    likeCount: 245,
    commentCount: 32,
    bookmarkCount: 178,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "p4",
    title: "Building a Design System from Scratch: Tokens to Components",
    slug: "building-design-system-tokens-to-components",
    excerpt:
      "A comprehensive walkthrough of building a scalable design system â€” from design tokens and primitives to complex compound components and documentation.",
    content: `# Building a Design System from Scratch

A well-crafted design system is one of the highest-leverage investments a team can make.

## Start with Design Tokens

\`\`\`json
{
  "color": {
    "primary": { "value": "#2563EB", "type": "color" },
    "secondary": { "value": "#7C3AED", "type": "color" }
  },
  "spacing": {
    "4": { "value": "1rem", "type": "dimension" }
  }
}
\`\`\`

## Build Primitive Components

Design systems succeed when primitives are rock-solid and accessible.`,
    featuredImage:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&q=80",
    status: "published",
    author: MOCK_USERS[1],
    category: MOCK_CATEGORIES[2],
    tags: [MOCK_TAGS[11], MOCK_TAGS[7]],
    publishedAt: "2025-05-28T14:00:00Z",
    createdAt: "2025-05-25T14:00:00Z",
    updatedAt: "2025-05-28T14:00:00Z",
    readingTime: 14,
    viewCount: 6890,
    likeCount: 201,
    commentCount: 19,
    bookmarkCount: 134,
    isFeatured: false,
    isTrending: false,
  },
  {
    id: "p5",
    title: "Kubernetes for Developers: From Zero to Production",
    slug: "kubernetes-for-developers-zero-to-production",
    excerpt:
      "Stop being intimidated by Kubernetes. This developer-focused guide gets you from zero to deploying real apps in production â€” no ops background needed.",
    content: `# Kubernetes for Developers

Kubernetes doesn't have to be scary. Let's break it down.

## Core Concepts

### Pods â€” the atomic unit

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: my-app:latest
    ports:
    - containerPort: 3000
\`\`\`

### Deployments â€” manage replicas

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:latest
\`\`\``,
    featuredImage:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=900&q=80",
    status: "published",
    author: MOCK_USERS[2],
    category: MOCK_CATEGORIES[3],
    tags: [MOCK_TAGS[9], MOCK_TAGS[15], MOCK_TAGS[6]],
    publishedAt: "2025-05-22T10:00:00Z",
    createdAt: "2025-05-20T10:00:00Z",
    updatedAt: "2025-05-22T10:00:00Z",
    readingTime: 10,
    viewCount: 5420,
    likeCount: 163,
    commentCount: 28,
    bookmarkCount: 112,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "p6",
    title: "Understanding LLMs: A Practical Guide for Developers",
    slug: "understanding-llms-practical-guide-developers",
    excerpt:
      "Demystify large language models from a developer's lens. Learn how transformers work, use APIs effectively, and build AI-powered features responsibly.",
    content: `# Understanding LLMs for Developers

Large language models are transforming what's possible in software development.

## How Transformers Work (Simplified)

The attention mechanism is at the heart of every LLM.

## Using LLM APIs Effectively

\`\`\`typescript
import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function streamChat(prompt: string) {
  const stream = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  })
  
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '')
  }
}
\`\`\``,
    featuredImage:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80",
    status: "published",
    author: MOCK_USERS[3],
    category: MOCK_CATEGORIES[4],
    tags: [MOCK_TAGS[10], MOCK_TAGS[12]],
    publishedAt: "2025-05-15T12:00:00Z",
    createdAt: "2025-05-12T12:00:00Z",
    updatedAt: "2025-05-15T12:00:00Z",
    readingTime: 12,
    viewCount: 11340,
    likeCount: 334,
    commentCount: 47,
    bookmarkCount: 243,
    isFeatured: true,
    isTrending: false,
  },
  {
    id: "p7",
    title: "React Server Components: The Complete Mental Model",
    slug: "react-server-components-complete-mental-model",
    excerpt:
      "Server Components fundamentally change how we think about React. This guide builds the right mental model from first principles.",
    content: `# React Server Components

Server Components are React's most significant architectural change since hooks.

## The Core Insight

Not every component needs to be interactive. Server Components embrace this.

\`\`\`tsx
// Server Component â€” runs on the server, zero JS to client
async function BlogPost({ slug }: { slug: string }) {
  const post = await db.posts.findBySlug(slug) // Direct DB access!
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
\`\`\``,
    featuredImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=80",
    status: "published",
    author: MOCK_USERS[0],
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_TAGS[0], MOCK_TAGS[2]],
    publishedAt: "2025-05-10T10:00:00Z",
    createdAt: "2025-05-08T10:00:00Z",
    updatedAt: "2025-05-10T10:00:00Z",
    readingTime: 9,
    viewCount: 13450,
    likeCount: 389,
    commentCount: 52,
    bookmarkCount: 267,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "p8",
    title: "CSS Grid Mastery: Every Technique You Need in One Place",
    slug: "css-grid-mastery-every-technique",
    excerpt:
      "From basic grid layouts to advanced subgrid, this is the definitive CSS Grid reference for 2025 â€” with interactive examples and real-world patterns.",
    content: `# CSS Grid Mastery

CSS Grid is the most powerful layout tool available in CSS. Let's master it.

## Grid Template Areas

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 240px 1fr 300px;
  grid-template-rows: 64px 1fr 80px;
}
\`\`\`

## Subgrid â€” the game-changer

\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.card {
  display: grid;
  grid-row: span 4;
  grid-template-rows: subgrid;
}
\`\`\``,
    featuredImage:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=900&q=80",
    status: "published",
    author: MOCK_USERS[1],
    category: MOCK_CATEGORIES[5],
    tags: [MOCK_TAGS[5], MOCK_TAGS[6]],
    publishedAt: "2025-05-05T09:00:00Z",
    createdAt: "2025-05-02T09:00:00Z",
    updatedAt: "2025-05-05T09:00:00Z",
    readingTime: 7,
    viewCount: 4230,
    likeCount: 127,
    commentCount: 14,
    bookmarkCount: 89,
    isFeatured: false,
    isTrending: false,
  },
  {
    id: "p9",
    title: "The Staff Engineer's Guide to Technical Decision Making",
    slug: "staff-engineer-guide-technical-decision-making",
    excerpt:
      "How senior engineers evaluate trade-offs, document architecture decisions, and build alignment across teams â€” practical frameworks that actually work.",
    content: `# Technical Decision Making at the Staff Level

Staff engineers are often the last line of defense before costly technical mistakes.

## The ADR Pattern

Architecture Decision Records document the reasoning behind significant technical choices.

\`\`\`markdown
# ADR-001: Use TanStack Query for Client State

## Status: Accepted

## Context
We need a consistent approach to server state management.

## Decision
We'll use TanStack Query v5 for all server state.

## Consequences
+ Consistent data fetching patterns
+ Built-in caching and background refetching
- Learning curve for team members new to the library
\`\`\`

> The goal isn't to be right. It's to make good decisions with incomplete information.`,
    featuredImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80",
    status: "published",
    author: MOCK_USERS[0],
    category: MOCK_CATEGORIES[7],
    tags: [MOCK_TAGS[8]],
    publishedAt: "2025-04-28T10:00:00Z",
    createdAt: "2025-04-25T10:00:00Z",
    updatedAt: "2025-04-28T10:00:00Z",
    readingTime: 8,
    viewCount: 9870,
    likeCount: 276,
    commentCount: 41,
    bookmarkCount: 198,
    isFeatured: false,
    isTrending: false,
  },
  {
    id: "p10",
    title: "Next.js 15 Deep Dive: App Router, PPR, and the Future",
    slug: "nextjs-15-deep-dive-app-router-ppr-future",
    excerpt:
      "Next.js 15 ships Partial Prerendering stable, faster builds with Turbopack, improved caching semantics, and async request APIs. Full breakdown inside.",
    content: `# Next.js 15 Deep Dive

Next.js 15 is a landmark release. Here's what's changed.

## Partial Prerendering (Stable)

PPR is one of the most innovative rendering models in web history.

\`\`\`tsx
import { Suspense } from 'react'
import { unstable_noStore as noStore } from 'next/cache'

export default function Page() {
  return (
    <>
      <StaticShell /> {/* Renders instantly from edge */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DynamicContent /> {/* Streams in dynamically */}
      </Suspense>
    </>
  )
}
\`\`\`

## Turbopack (Production-Ready)

Build times are now **60% faster** on cold builds.`,
    featuredImage:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=900&q=80",
    status: "draft",
    author: MOCK_USERS[0],
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_TAGS[0], MOCK_TAGS[2], MOCK_TAGS[6]],
    createdAt: "2025-06-18T10:00:00Z",
    updatedAt: "2025-06-20T10:00:00Z",
    readingTime: 13,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    bookmarkCount: 0,
    isFeatured: false,
    isTrending: false,
  },
  {
    id: "p11",
    title: "GraphQL vs REST vs tRPC: Choosing Your API Strategy in 2025",
    slug: "graphql-rest-trpc-api-strategy-2025",
    excerpt:
      "An honest comparison of the three dominant API paradigms â€” when each shines, when each struggles, and how to pick the right one for your project.",
    content: `# API Strategy in 2025

The choice of API paradigm affects your entire development experience.

## REST: The Proven Default

REST remains the most widely adopted style, with excellent tooling and broad ecosystem support.

## GraphQL: Flexibility at a Cost

GraphQL shines for complex, relationship-heavy data with multiple clients.

## tRPC: End-to-End Type Safety

tRPC provides unparalleled type safety for TypeScript monorepos.

\`\`\`typescript
// Server
const appRouter = router({
  post: router({
    list: publicProcedure.query(async () => {
      return await db.posts.findMany()
    }),
    bySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.posts.findBySlug(input)
      }),
  }),
})
\`\`\``,
    featuredImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=80",
    status: "scheduled",
    author: MOCK_USERS[2],
    category: MOCK_CATEGORIES[6],
    tags: [MOCK_TAGS[16], MOCK_TAGS[12]],
    scheduledAt: "2025-07-01T10:00:00Z",
    createdAt: "2025-06-15T10:00:00Z",
    updatedAt: "2025-06-20T10:00:00Z",
    readingTime: 11,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    bookmarkCount: 0,
    isFeatured: false,
    isTrending: false,
  },
  {
    id: "p12",
    title: "React Performance Optimization: Every Technique That Matters",
    slug: "react-performance-optimization-every-technique",
    excerpt:
      "Memo, useCallback, useMemo, lazy loading, virtualization, bundle splitting â€” the complete performance toolkit with real benchmarks.",
    content: `# React Performance Optimization

Performance optimization is only valuable when it solves a real problem. Profile first.

## The Golden Rule

> Don't optimize prematurely. Measure, identify bottlenecks, then optimize.

## useMemo and useCallback â€” Use Sparingly

\`\`\`tsx
// Only memoize when the computation is expensive
const sortedList = useMemo(() => {
  return [...items].sort((a, b) => a.priority - b.priority)
}, [items])
\`\`\`

## React.memo â€” Prevent Unnecessary Re-renders

\`\`\`tsx
const ExpensiveCard = React.memo(({ post }: { post: Post }) => {
  return <div>{post.title}</div>
}, (prev, next) => prev.post.id === next.post.id)
\`\`\``,
    featuredImage:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&q=80",
    status: "published",
    author: MOCK_USERS[0],
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_TAGS[0], MOCK_TAGS[6], MOCK_TAGS[13]],
    publishedAt: "2025-04-20T10:00:00Z",
    createdAt: "2025-04-18T10:00:00Z",
    updatedAt: "2025-04-20T10:00:00Z",
    readingTime: 10,
    viewCount: 7650,
    likeCount: 222,
    commentCount: 29,
    bookmarkCount: 145,
    isFeatured: false,
    isTrending: false,
  },
];

// â”€â”€â”€ Comments â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "cm1",
    postId: "p1",
    postTitle: "Building Modern React Apps with TypeScript and Vite in 2025",
    author: MOCK_USERS[4],
    content:
      "This is exactly what I needed. The Vite setup section alone saved me hours. Thank you!",
    status: "approved",
    likeCount: 12,
    createdAt: "2025-06-11T10:00:00Z",
    updatedAt: "2025-06-11T10:00:00Z",
  },
  {
    id: "cm2",
    postId: "p1",
    postTitle: "Building Modern React Apps with TypeScript and Vite in 2025",
    author: MOCK_USERS[6],
    content:
      "Great article! One question â€” do you recommend using pnpm over npm for new projects?",
    status: "approved",
    likeCount: 5,
    createdAt: "2025-06-12T14:00:00Z",
    updatedAt: "2025-06-12T14:00:00Z",
  },
  {
    id: "cm3",
    postId: "p3",
    postTitle: "Advanced TypeScript Patterns Every Senior Dev Should Know",
    author: MOCK_USERS[7],
    content:
      "The conditional types section blew my mind. I've been writing TypeScript for 3 years and still learned something new.",
    status: "approved",
    likeCount: 18,
    createdAt: "2025-06-02T11:00:00Z",
    updatedAt: "2025-06-02T11:00:00Z",
  },
  {
    id: "cm4",
    postId: "p6",
    postTitle: "Understanding LLMs: A Practical Guide for Developers",
    author: MOCK_USERS[4],
    content:
      "The streaming example is particularly helpful. Would love a follow-up on RAG patterns.",
    status: "pending",
    likeCount: 7,
    createdAt: "2025-05-16T09:00:00Z",
    updatedAt: "2025-05-16T09:00:00Z",
  },
  {
    id: "cm5",
    postId: "p7",
    postTitle: "React Server Components: The Complete Mental Model",
    author: MOCK_USERS[6],
    content:
      "I've read 10 articles about RSC and this is the first one that finally made it click.",
    status: "approved",
    likeCount: 24,
    createdAt: "2025-05-11T08:00:00Z",
    updatedAt: "2025-05-11T08:00:00Z",
  },
  {
    id: "cm6",
    postId: "p2",
    postTitle: "Mastering Tailwind CSS v4: The Complete Developer Guide",
    author: MOCK_USERS[7],
    content: "Spam comment â€” buy cheap watches now!!!",
    status: "spam",
    likeCount: 0,
    createdAt: "2025-06-06T10:00:00Z",
    updatedAt: "2025-06-06T10:00:00Z",
  },
  {
    id: "cm7",
    postId: "p9",
    postTitle: "The Staff Engineer's Guide to Technical Decision Making",
    author: MOCK_USERS[4],
    content:
      "The ADR pattern is underrated. We've used it for 2 years and it's saved us from a ton of \"why did we build it this way\" meetings.",
    status: "approved",
    likeCount: 31,
    createdAt: "2025-04-29T15:00:00Z",
    updatedAt: "2025-04-29T15:00:00Z",
  },
];

// â”€â”€â”€ Notifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "comment",
    title: "New comment on your post",
    message: 'Jordan Kim commented on "Building Modern React Apps..."',
    isRead: false,
    link: "/blog/building-modern-react-apps-typescript-vite-2025",
    actor: MOCK_USERS[4],
    createdAt: "2025-06-20T09:00:00Z",
  },
  {
    id: "n2",
    type: "like",
    title: "Someone liked your post",
    message: 'Riley Morgan liked "Advanced TypeScript Patterns..."',
    isRead: false,
    link: "/blog/advanced-typescript-patterns-senior-dev",
    actor: MOCK_USERS[5],
    createdAt: "2025-06-20T08:30:00Z",
  },
  {
    id: "n3",
    type: "follow",
    title: "New follower",
    message: "Sam Rivera started following you",
    isRead: true,
    actor: MOCK_USERS[6],
    createdAt: "2025-06-19T14:00:00Z",
  },
  {
    id: "n4",
    type: "publish",
    title: "Post published",
    message: 'Your post "Mastering Tailwind CSS v4..." is now live',
    isRead: true,
    link: "/blog/mastering-tailwind-css-v4-complete-guide",
    createdAt: "2025-06-05T09:05:00Z",
  },
  {
    id: "n5",
    type: "system",
    title: "Weekly digest ready",
    message: "Your weekly performance report is ready to view",
    isRead: false,
    link: "/dashboard/analytics",
    createdAt: "2025-06-18T07:00:00Z",
  },
  {
    id: "n6",
    type: "mention",
    title: "You were mentioned",
    message:
      'Taylor Wu mentioned you in a comment on "React Server Components..."',
    isRead: false,
    actor: MOCK_USERS[7],
    createdAt: "2025-06-17T16:00:00Z",
  },
];

// â”€â”€â”€ Media â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_MEDIA: MediaFile[] = [
  {
    id: "m1",
    name: "hero-react.jpg",
    url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=60",
    type: "image",
    mimeType: "image/jpeg",
    size: 248000,
    width: 900,
    height: 600,
    uploadedBy: MOCK_USERS[0],
    createdAt: "2025-06-08T10:00:00Z",
  },
  {
    id: "m2",
    name: "tailwind-bg.jpg",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=60",
    type: "image",
    mimeType: "image/jpeg",
    size: 182000,
    width: 900,
    height: 600,
    uploadedBy: MOCK_USERS[1],
    createdAt: "2025-06-03T09:00:00Z",
  },
  {
    id: "m3",
    name: "typescript-code.jpg",
    url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=900&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=200&q=60",
    type: "image",
    mimeType: "image/jpeg",
    size: 203000,
    width: 900,
    height: 600,
    uploadedBy: MOCK_USERS[0],
    createdAt: "2025-05-30T11:00:00Z",
  },
  {
    id: "m4",
    name: "design-system.jpg",
    url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&q=60",
    type: "image",
    mimeType: "image/jpeg",
    size: 215000,
    width: 900,
    height: 600,
    uploadedBy: MOCK_USERS[1],
    createdAt: "2025-05-25T14:00:00Z",
  },
  {
    id: "m5",
    name: "kubernetes.jpg",
    url: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=900&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=200&q=60",
    type: "image",
    mimeType: "image/jpeg",
    size: 195000,
    width: 900,
    height: 600,
    uploadedBy: MOCK_USERS[2],
    createdAt: "2025-05-20T10:00:00Z",
  },
  {
    id: "m6",
    name: "ai-llm.jpg",
    url: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=200&q=60",
    type: "image",
    mimeType: "image/jpeg",
    size: 178000,
    width: 900,
    height: 600,
    uploadedBy: MOCK_USERS[3],
    createdAt: "2025-05-12T12:00:00Z",
  },
  {
    id: "m7",
    name: "performance.jpg",
    url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&q=60",
    type: "image",
    mimeType: "image/jpeg",
    size: 224000,
    width: 900,
    height: 600,
    uploadedBy: MOCK_USERS[0],
    createdAt: "2025-04-18T10:00:00Z",
  },
  {
    id: "m8",
    name: "team.jpg",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=60",
    type: "image",
    mimeType: "image/jpeg",
    size: 312000,
    width: 900,
    height: 600,
    uploadedBy: MOCK_USERS[0],
    createdAt: "2025-04-25T10:00:00Z",
  },
];

// â”€â”€â”€ Subscribers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_SUBSCRIBERS: Subscriber[] = [
  {
    id: "s1",
    email: "jordan@example.com",
    name: "Jordan Kim",
    status: "active",
    source: "blog",
    subscribedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "s2",
    email: "riley@example.com",
    name: "Riley Morgan",
    status: "active",
    source: "homepage",
    subscribedAt: "2025-02-20T10:00:00Z",
  },
  {
    id: "s3",
    email: "sam@example.com",
    name: "Sam Rivera",
    status: "unsubscribed",
    source: "blog",
    subscribedAt: "2024-11-10T10:00:00Z",
    unsubscribedAt: "2025-03-15T10:00:00Z",
  },
  {
    id: "s4",
    email: "taylor@example.com",
    name: "Taylor Wu",
    status: "active",
    source: "newsletter_popup",
    subscribedAt: "2025-03-01T10:00:00Z",
  },
  {
    id: "s5",
    email: "charlie@example.com",
    name: "Charlie Davis",
    status: "active",
    source: "homepage",
    subscribedAt: "2025-04-10T10:00:00Z",
  },
  {
    id: "s6",
    email: "diana@example.com",
    name: "Diana Prince",
    status: "bounced",
    source: "blog",
    subscribedAt: "2024-12-20T10:00:00Z",
  },
  {
    id: "s7",
    email: "evan@example.com",
    name: "Evan Torres",
    status: "active",
    source: "blog",
    subscribedAt: "2025-05-08T10:00:00Z",
  },
  {
    id: "s8",
    email: "faye@example.com",
    name: "Faye Wilson",
    status: "active",
    source: "homepage",
    subscribedAt: "2025-05-25T10:00:00Z",
  },
];

// â”€â”€â”€ Analytics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_ANALYTICS_SUMMARY: AnalyticsSummary = {
  totalViews: 98450,
  totalPosts: 127,
  totalUsers: 3842,
  totalComments: 2156,
  totalSubscribers: 4287,
  totalLikes: 18920,
  viewsGrowth: 18.4,
  postsGrowth: 8.2,
  usersGrowth: 24.7,
  commentsGrowth: 12.3,
  likesGrowth: 15.6,
  subscribersGrowth: 9.8,
};

export const MOCK_ANALYTICS_DATA: AnalyticsDataPoint[] = [
  {
    date: "Jan",
    views: 4200,
    visitors: 3100,
    comments: 145,
    likes: 890,
    newUsers: 280,
  },
  {
    date: "Feb",
    views: 5800,
    visitors: 4200,
    comments: 167,
    likes: 1100,
    newUsers: 315,
  },
  {
    date: "Mar",
    views: 7200,
    visitors: 5400,
    comments: 198,
    likes: 1450,
    newUsers: 390,
  },
  {
    date: "Apr",
    views: 6900,
    visitors: 5100,
    comments: 182,
    likes: 1320,
    newUsers: 360,
  },
  {
    date: "May",
    views: 9100,
    visitors: 6800,
    comments: 243,
    likes: 1890,
    newUsers: 480,
  },
  {
    date: "Jun",
    views: 11200,
    visitors: 8200,
    comments: 312,
    likes: 2340,
    newUsers: 580,
  },
  {
    date: "Jul",
    views: 10400,
    visitors: 7800,
    comments: 278,
    likes: 2100,
    newUsers: 520,
  },
  {
    date: "Aug",
    views: 12800,
    visitors: 9400,
    comments: 345,
    likes: 2680,
    newUsers: 640,
  },
  {
    date: "Sep",
    views: 14200,
    visitors: 10500,
    comments: 389,
    likes: 3100,
    newUsers: 720,
  },
  {
    date: "Oct",
    views: 13600,
    visitors: 10100,
    comments: 356,
    likes: 2890,
    newUsers: 680,
  },
  {
    date: "Nov",
    views: 15800,
    visitors: 11700,
    comments: 420,
    likes: 3450,
    newUsers: 790,
  },
  {
    date: "Dec",
    views: 18900,
    visitors: 14200,
    comments: 510,
    likes: 4280,
    newUsers: 920,
  },
];

export const MOCK_TOP_POSTS: TopPost[] = [
  {
    id: "p7",
    title: "React Server Components: The Complete Mental Model",
    slug: "react-server-components-complete-mental-model",
    featuredImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&q=60",
    views: 13450,
    likes: 389,
    comments: 52,
  },
  {
    id: "p1",
    title: "Building Modern React Apps with TypeScript and Vite",
    slug: "building-modern-react-apps-typescript-vite-2025",
    featuredImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=60",
    views: 14520,
    likes: 412,
    comments: 38,
  },
  {
    id: "p6",
    title: "Understanding LLMs: A Practical Guide for Developers",
    slug: "understanding-llms-practical-guide-developers",
    featuredImage:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=200&q=60",
    views: 11340,
    likes: 334,
    comments: 47,
  },
  {
    id: "p2",
    title: "Mastering Tailwind CSS v4: The Complete Developer Guide",
    slug: "mastering-tailwind-css-v4-complete-guide",
    featuredImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=60",
    views: 10230,
    likes: 298,
    comments: 25,
  },
  {
    id: "p9",
    title: "The Staff Engineer's Guide to Technical Decision Making",
    slug: "staff-engineer-guide-technical-decision-making",
    featuredImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=60",
    views: 9870,
    likes: 276,
    comments: 41,
  },
];

export const MOCK_TRAFFIC_SOURCES: TrafficSource[] = [
  { source: "Organic Search", visits: 42340, percentage: 43 },
  { source: "Direct", visits: 21560, percentage: 22 },
  { source: "Social Media", visits: 18780, percentage: 19 },
  { source: "Referral", visits: 9820, percentage: 10 },
  { source: "Email", visits: 5950, percentage: 6 },
];

export const MOCK_DEVICE_STATS: DeviceStats[] = [
  { device: "Desktop", sessions: 54230, percentage: 55 },
  { device: "Mobile", sessions: 35890, percentage: 36 },
  { device: "Tablet", sessions: 8780, percentage: 9 },
];

// â”€â”€â”€ Activity Logs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "al1",
    user: MOCK_USERS[0],
    action: "published",
    resource: "post",
    resourceId: "p1",
    details: 'Published "Building Modern React Apps..."',
    ipAddress: "192.168.1.1",
    createdAt: "2025-06-10T10:00:00Z",
  },
  {
    id: "al2",
    user: MOCK_USERS[1],
    action: "created",
    resource: "post",
    resourceId: "p2",
    details: 'Created draft "Mastering Tailwind CSS v4..."',
    ipAddress: "192.168.1.2",
    createdAt: "2025-06-03T09:00:00Z",
  },
  {
    id: "al3",
    user: MOCK_USERS[0],
    action: "deleted",
    resource: "comment",
    resourceId: "cm6",
    details: "Deleted spam comment",
    ipAddress: "192.168.1.1",
    createdAt: "2025-06-06T10:00:00Z",
  },
  {
    id: "al4",
    user: MOCK_USERS[0],
    action: "updated",
    resource: "user",
    resourceId: "u6",
    details: "Suspended user Riley Morgan",
    ipAddress: "192.168.1.1",
    createdAt: "2025-06-01T14:00:00Z",
  },
  {
    id: "al5",
    user: MOCK_USERS[2],
    action: "created",
    resource: "post",
    resourceId: "p11",
    details: 'Created "GraphQL vs REST vs tRPC..."',
    ipAddress: "192.168.1.3",
    createdAt: "2025-06-15T10:00:00Z",
  },
  {
    id: "al6",
    user: MOCK_USERS[0],
    action: "login",
    resource: "auth",
    details: "Admin login",
    ipAddress: "192.168.1.1",
    createdAt: "2025-06-20T08:30:00Z",
  },
];

// â”€â”€â”€ Email Templates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "et1",
    name: "Welcome Email",
    subject: "Welcome to BlogMint! ðŸŽ‰",
    body: "<h1>Welcome!</h1><p>Thanks for joining BlogMint...</p>",
    type: "welcome",
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "et2",
    name: "Weekly Digest",
    subject: "ðŸ“° Your Weekly Dev Digest - {{date}}",
    body: "<h1>This Week in Dev</h1>...",
    type: "newsletter",
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "et3",
    name: "New Post Notification",
    subject: "ðŸ“ New post: {{post.title}}",
    body: "<h1>{{post.title}}</h1>...",
    type: "notification",
    createdAt: "2022-06-01T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
];

// â”€â”€â”€ Campaigns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "ca1",
    name: "June Newsletter",
    subject: "ðŸ“° Your June Dev Digest",
    templateId: "et2",
    status: "sent",
    recipientCount: 4120,
    openRate: 42.3,
    clickRate: 18.7,
    sentAt: "2025-06-01T09:00:00Z",
    createdAt: "2025-05-28T10:00:00Z",
  },
  {
    id: "ca2",
    name: "RSC Article Promo",
    subject: "ðŸš€ New: React Server Components Deep Dive",
    templateId: "et3",
    status: "sent",
    recipientCount: 4087,
    openRate: 38.9,
    clickRate: 22.4,
    sentAt: "2025-05-10T10:00:00Z",
    createdAt: "2025-05-09T10:00:00Z",
  },
  {
    id: "ca3",
    name: "July Newsletter",
    subject: "ðŸ“° Your July Dev Digest",
    templateId: "et2",
    status: "scheduled",
    recipientCount: 4287,
    scheduledAt: "2025-07-01T09:00:00Z",
    createdAt: "2025-06-20T10:00:00Z",
  },
];
