import { prisma } from "./client";

type PostSeed = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  category:
    | "technology"
    | "programming"
    | "ai-ml"
    | "design"
    | "cloud-devops"
    | "cybersecurity"
    | "productivity";
  authorEmail: string;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  viewCount?: number;
};

const posts: PostSeed[] = [
  {
    title: "Building a Calm Digital Workspace",
    slug: "building-a-calm-digital-workspace",
    excerpt:
      "A practical approach to reducing digital noise, organizing tools, and making focused work effortless.",
    content: `## The Problem with Digital Noise

In modern software development and design, context switching is one of the highest taxes on mental clarity. Every notification, unorganized browser tab, and cluttered desktop consumes cognitive energy before work even begins.

### Step 1: Minimize Decision Fatigue

A calm digital workspace starts with fewer decisions:
- **Keep everyday tools visible**: Pin your 4 primary apps (editor, terminal, browser, notes).
- **Move everything else out of view**: Minimize active background apps.
- **Set structured notification windows**: Batch notifications twice a day rather than reacting immediately.

### Step 2: Establish a Shutdown Ritual

Create a short 5-minute end-of-day checklist:
1. Close temporary tabs.
2. Commit local code changes.
3. Write down tomorrow's primary focus task.

> "Simplicity is not about having less. It is about making room for what matters."

By intentionally curating your workspace, you build an environment where deep work can thrive naturaly.`,
    featuredImageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85",
    category: "productivity",
    authorEmail: "sarah.chen@example.com",
    tags: ["ui-ux", "web-performance"],
    featured: true,
  },
  {
    title: "The Small Habits Behind Reliable Software",
    slug: "small-habits-behind-reliable-software",
    excerpt:
      "Reliable systems are usually the result of small engineering habits repeated consistently across teams.",
    content: `## Engineering for Long-Term Stability

High-performing teams rarely rely on heroic late-night debugging sessions. Instead, they cultivate quiet engineering discipline.

### Key Practices

1. **Clear Pull Request Descriptions**: Context matters as much as the diff itself. Explain *why* a decision was made.
2. **Actionable Logging**: Structured logs (JSON format with correlation IDs) turn runtime mysteries into solvable telemetry.
3. **Small, Atomic Deployments**: Ship small updates frequently rather than massive quarterly releases.
4. **Behavioral Tests**: Write tests that describe business behavior, not internal framework implementation details.

\`\`\`typescript
// Example: Explicit error boundaries in TypeScript domain logic
type Result<T, E extends Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

export function parseConfig(raw: string): Result<Config, ConfigValidationError> {
  try {
    const parsed = JSON.parse(raw);
    return { ok: true, value: validateConfig(parsed) };
  } catch (err) {
    return { ok: false, error: new ConfigValidationError("Invalid configuration payload", { cause: err }) };
  }
}
\`\`\`

These habits drastically reduce production surprises and give teams confidence when refactoring core modules.`,
    featuredImageUrl:
      "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1600&q=85",
    category: "programming",
    authorEmail: "alex.rivera@example.com",
    tags: ["typescript", "devops", "security"],
    trending: true,
  },
  {
    title: "React Server and Client Components: A Practical Guide",
    slug: "react-server-and-client-components-practical-guide",
    excerpt:
      "Understand where server and client components belong in Next.js and how to keep boundaries intentional.",
    content: `## Navigating the Component Boundary

React Server Components (RSC) represent a paradigm shift in full-stack frontend development. By defaulting components to the server, Next.js applications ship zero JavaScript to the client for purely static or server-rendered layouts.

### When to use Server Components

- Data fetching directly from databases or external microservices.
- Accessing backend resources (file system, environment secrets).
- Rendering large libraries (e.g., markdown parsers, syntax highlighters) without bloating client bundles.

### When to use Client Components ('use client')

- Interactive state management (\`useState\`, \`useReducer\`).
- Browser event listeners (\`onClick\`, \`onChange\`, \`onKeyDown\`).
- Custom DOM animation hooks and browser API access (\`localStorage\`, window dimensions).

\`\`\`tsx
// Modern Server Component fetching data directly
import { prisma } from "@/lib/db";

export default async function BlogFeed() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    take: 10,
  });

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <article key={post.id} className="p-4 rounded-lg border">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
\`\`\`

Keeping your component tree predominantly on the server yields faster load times and cleaner client-side architecture.`,
    featuredImageUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=85",
    category: "programming",
    authorEmail: "sarah.chen@example.com",
    tags: ["react", "nextjs", "typescript"],
    featured: true,
  },
  {
    title: "TypeScript Patterns That Keep Large Codebases Clear",
    slug: "typescript-patterns-large-codebases",
    excerpt:
      "A handful of simple, expressive TypeScript patterns can make growing applications far easier to scale.",
    content: `## Type Safety at Scale

As a codebase grows beyond 50,000 lines, maintainability depends heavily on how domain concepts are represented in code.

### 1. Discriminated Unions for State Machines

Avoid boolean flag soup like \`isLoading\`, \`isError\`, \`hasData\`. Use discriminated unions instead:

\`\`\`typescript
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
\`\`\`

### 2. Opaque Types for Identifiers

Prevent accidentally passing a \`UserId\` to a function expecting a \`PostId\`:

\`\`\`typescript
declare const brand: unique symbol;
type Brand<K, T> = K & { [brand]: T };

export type UserId = Brand<string, "UserId">;
export type PostId = Brand<string, "PostId">;
\`\`\`

Using these explicit patterns keeps domain rules transparent to developers and caught at compile-time by TypeScript.`,
    featuredImageUrl:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1600&q=85",
    category: "programming",
    authorEmail: "sarah.chen@example.com",
    tags: ["typescript", "javascript"],
  },
  {
    title: "Designing REST APIs People Enjoy Using",
    slug: "designing-rest-apis-people-enjoy-using",
    excerpt:
      "Good API design makes the common path obvious, errors actionable, and performance predictable.",
    content: `## The Principles of Developer-Friendly APIs

An API is a product interface for developers. When designed thoughtfully, it accelerates integration and minimizes support overhead.

### Essential API Guidelines

- **Nouns over Verbs**: Use \`GET /api/v1/posts\` instead of \`GET /api/v1/getPosts\`.
- **Consistent Error Schemas**: Always return standard error objects containing code, message, and details.
- **Cursor-Based Pagination**: Scale list endpoints reliably using cursors rather than offset-based skip.

\`\`\`json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested post slug 'invalid-slug' does not exist.",
    "status": 404
  }
}
\`\`\`

Predictability in naming and behavior is what makes an API a joy to consume.`,
    featuredImageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=85",
    category: "programming",
    authorEmail: "alex.rivera@example.com",
    tags: ["api", "rest-api", "nodejs"],
    trending: true,
  },
  {
    title: "Kubernetes & Infrastructure for Modern Applications",
    slug: "kubernetes-infrastructure-for-modern-applications",
    excerpt:
      "Building elastic, self-healing cloud infrastructure using Docker containers and Kubernetes clusters.",
    content: `## Scaling Infrastructure with Confidence

Containerization solved the classic "works on my machine" crisis. Kubernetes took it a step further by offering automated orchestration, rolling updates, and self-healing cluster nodes.

### Core Kubernetes Abstractions

- **Pods**: The smallest deployable units containing one or more containers.
- **Deployments**: Declarative descriptions of desired application state.
- **Services**: Stable network endpoints and internal load balancers.
- **Ingress Controllers**: External traffic routing rules and TLS termination.

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-api
  template:
    metadata:
      labels:
        app: web-api
    spec:
      containers:
      - name: api
        image: registry.example.com/api:v1.2.0
        ports:
        - containerPort: 3000
\`\`\`

With declarative manifests and automated ingress, teams can focus on shipping features rather than managing server instances manually.`,
    featuredImageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85",
    category: "cloud-devops",
    authorEmail: "marcus.vance@example.com",
    tags: ["cloud", "devops", "kubernetes", "docker"],
  },
  {
    title: "A Gentle Introduction to Machine Learning & LLMs",
    slug: "a-gentle-introduction-to-machine-learning",
    excerpt:
      "Machine learning becomes approachable when its core concepts, embeddings, and fine-tuning are made concrete.",
    content: `## Demystifying Artificial Intelligence

At its core, Machine Learning is about pattern recognition. Rather than writing explicit conditional code for every edge case, we supply algorithms with data and allow them to infer mathematical functions.

### The Modern AI Stack

1. **Embeddings**: Converting text into dense multi-dimensional vector spaces.
2. **Transformers**: Attention mechanisms that model relationships between tokens across context windows.
3. **Fine-Tuning & RAG**: Enhancing model responses using domain-specific knowledge bases and retrieval mechanisms.

\`\`\`python
# Conceptual RAG Pipeline snippet
from langchain.vectorstores import PGVector
from langchain.embeddings import OpenAIEmbeddings

def query_knowledge_base(user_prompt: str):
    embeddings = OpenAIEmbeddings()
    vector_store = PGVector(connection_string=DATABASE_URL, embedding_function=embeddings)
    similar_docs = vector_store.similarity_search(user_prompt, k=3)
    return similar_docs
\`\`\`

Understanding vectors and context windows allows engineers to integrate AI models into production applications seamlessly.`,
    featuredImageUrl:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1600&q=85",
    category: "ai-ml",
    authorEmail: "elena.rostova@example.com",
    tags: ["ai", "machine-learning", "python"],
    featured: true,
  },
  {
    title: "The Product Designer's Guide to Useful Empty States",
    slug: "product-designers-guide-to-useful-empty-states",
    excerpt:
      "An empty screen is a golden opportunity to orient people, guide action, and build user trust.",
    content: `## Designing for the Zero State

When users first sign up for an app or clear their task list, they encounter an empty state. Far too often, designers treat this space as an afterthought.

### Three Rules for Exceptional Empty States

1. **Explain What Belongs Here**: Be clear about what data will populate the screen once active.
2. **Explain Why It Is Empty**: Distinguish between "no records created yet" vs "search query returned no results".
3. **Provide a Single Primary Action**: Give users a high-contrast button like "Create First Project" or "Import CSV".

A well-crafted empty state builds momentum for new users right when they need guidance most.`,
    featuredImageUrl:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=85",
    category: "design",
    authorEmail: "sarah.chen@example.com",
    tags: ["design", "ui-ux"],
  },
  {
    title: "Making Web Security & Authentication Rock Solid",
    slug: "making-authentication-boring-in-the-best-way",
    excerpt:
      "Authentication should be dependable, understandable, and resistant to modern security vulnerabilities.",
    content: `## Defense in Depth for Web Apps

Authentication mechanisms are the front door to user confidentiality. Security breaches rarely happen because of obscure mathematical flaws; they happen due to forgotten operational edge cases.

### Essential Security Checklist

- **Use HTTP-Only, SameSite Cookies**: Never store sensitive session JWTs in unencrypted localStorage.
- **Implement Rate Limiting**: Protect authentication endpoints against brute-force attacks with IP & token buckets.
- **Enforce Strong Password Policies**: Use scrypt, bcrypt, or Argon2id with high memory cost parameters.
- **CSRF & CORS Controls**: Strictly configure allowed origins and validate origin headers on state-mutating requests.

\`\`\`typescript
// Rate limiting protection example
import { Arcjet } from "@arcjet/next";

export const securityShield = Arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    Arcjet.rateLimit({
      mode: "LIVE",
      characteristics: ["ip.src"],
      window: "1m",
      max: 10,
    }),
  ],
});
\`\`\`

Boring, proven security standards give developers peace of mind and protect users seamlessly.`,
    featuredImageUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1600&q=85",
    category: "cybersecurity",
    authorEmail: "alex.rivera@example.com",
    tags: ["authentication", "security", "api"],
    trending: true,
  },
  {
    title: "Prisma Queries & Index Optimization",
    slug: "prisma-queries-that-stay-fast-as-data-grows",
    excerpt:
      "A few deliberate indexing and query selection choices keep Prisma ORM applications blazingly fast.",
    content: `## Database Performance Tuning with Prisma

Prisma makes database interactions intuitive, but improper query design can lead to N+1 query traps or high query latency as row counts enter millions.

### Key Performance Best Practices

1. **Select Only Needed Fields**: Avoid returning huge text fields when displaying concise list cards.
2. **Add Composite Indexes for Common Filters**: Match your \`@@index\` annotations to your actual \`WHERE\` and \`ORDER BY\` queries.
3. **Use Prisma Transactions Appropriately**: Batch multiple updates inside a single database transaction to cut roundtrip latency.

\`\`\`prisma
model Post {
  id         String   @id @default(cuid())
  slug       String   @unique
  status     PostStatus
  isDeleted  Boolean  @default(false)
  createdAt  DateTime @default(now())

  @@index([status, isDeleted, createdAt])
}
\`\`\`

Measuring query durations with database logging turns slow page loads into straightforward optimization tasks.`,
    featuredImageUrl:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1600&q=85",
    category: "programming",
    authorEmail: "alex.rivera@example.com",
    tags: ["prisma", "postgresql"],
  },
  {
    title: "Building LLM-Powered Assistants with Modern AI APIs",
    slug: "building-llm-powered-assistants-with-modern-ai-apis",
    excerpt:
      "Learn how to build responsive, streaming AI chat tools using Google Gemini and Vercel AI SDK.",
    content: `## Integrating Large Language Models into Web Applications

Generative AI capabilities can transform static apps into interactive companions. Building reliable AI assistants requires clean prompt engineering, streaming responses, and fallbacks.

### Architecture Overview

- **Streaming HTTP Responses**: Use Server-Sent Events (SSE) so users see tokens rendered in real-time.
- **System Instructions**: Clearly define boundaries, tone, and constraints for the AI agent.
- **Tool Calling**: Allow the model to request external live data (search queries, database lookups).

\`\`\`typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSummary(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: 'Summarize the following article concisely in 3 bullet points:\n\n' + text,
  });
  return response.text;
}
\`\`\`

Streaming user experiences coupled with fast Gemini models make AI interactions fluid and immediate.`,
    featuredImageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=85",
    category: "ai-ml",
    authorEmail: "elena.rostova@example.com",
    tags: ["ai", "machine-learning", "nextjs", "api"],
    trending: true,
  },
  {
    title: "System Architecture: Designing for High Availability",
    slug: "system-architecture-designing-for-high-availability",
    excerpt:
      "Principles of resilient distributed system design, redundancy, and graceful degradation under load.",
    content: `## Building Fault-Tolerant Cloud Systems

High availability requires designing systems under the assumption that hardware, networks, and external services will eventually fail.

### Core Architectural Patterns

- **Decoupled Asynchronous Workers**: Move heavy background jobs (image processing, emails) to message queues like Redis or BullMQ.
- **Circuit Breakers**: Prevent cascading failure by tripping open when downstream APIs experience elevated error rates.
- **Read-Replication**: Offload read-heavy database workloads to secondary replica DB nodes.

Architecting for resilience ensures your application stays operational during unexpected traffic spikes.`,
    featuredImageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85",
    category: "cloud-devops",
    authorEmail: "marcus.vance@example.com",
    tags: ["system-design", "cloud", "devops", "aws"],
    featured: true,
  },
];

export async function runPostSeed() {
  console.log("📝 Running Post Seed...");

  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    throw new Error("❌ Admin user is required before seeding posts.");
  }

  for (const post of posts) {
    const existing = await prisma.post.findUnique({
      where: { slug: post.slug },
    });

    if (existing) {
      await prisma.post.update({
        where: { id: existing.id },
        data: { authorId: admin.id, viewCount: 0 },
      });
      console.log(`⏭️ Post already exists: ${post.title}`);
      continue;
    }

    const category = await prisma.category.findUnique({
      where: { slug: post.category },
    });

    if (!category) {
      console.warn(
        `⚠️ Category missing: ${post.category}. Skipping post ${post.title}.`,
      );
      continue;
    }

    const tags = await prisma.tag.findMany({
      where: { slug: { in: post.tags } },
    });

    const wordCount = post.content.split(/\s+/).length;
    const calculatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

    await prisma.post.create({
      data: {
        id: crypto.randomUUID(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImageUrl: post.featuredImageUrl,
        status: "PUBLISHED",
        isFeatured: post.featured ?? false,
        isTrending: post.trending ?? false,
        viewCount: 0,
        readingTime: calculatedReadingTime,
        publishedAt: new Date(
          Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
        ),
        authorId: admin.id,
        categoryId: category.id,
        seoTitle: `${post.title} | Mindful Blog`,
        seoDescription: post.excerpt,
        tags: {
          create: tags.map((t) => ({ tagId: t.id })),
        },
      },
    });

    console.log(`➕ Created post: ${post.title}`);
  }

  console.log("🎉 Post seed completed");
}
