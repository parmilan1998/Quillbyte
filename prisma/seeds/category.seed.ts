import "dotenv/config";
import { prisma } from "./client";

const categories = [
  {
    name: "Technology",
    slug: "technology",
    description: "Tech news, hardware innovations, tools, and digital trends",
    color: "#6366f1",
    metaTitle: "Technology Articles & News | Mindful Blog",
    metaDescription: "Explore the latest insights on software technology, hardware trends, and digital tools.",
    icon: "Cpu",
    order: 1,
  },
  {
    name: "Programming",
    slug: "programming",
    description: "Coding tutorials, software architecture, and engineering practices",
    color: "#3b82f6",
    metaTitle: "Programming & Code Tutorials | Mindful Blog",
    metaDescription: "Deep dives into React, Next.js, TypeScript, Node.js, and modern web development.",
    icon: "Code",
    order: 2,
  },
  {
    name: "AI & ML",
    slug: "ai-ml",
    description: "Artificial Intelligence, Large Language Models, and Machine Learning",
    color: "#a855f7",
    metaTitle: "Artificial Intelligence & Machine Learning | Mindful Blog",
    metaDescription: "Practical guides and analysis on AI engineering, LLMs, prompt design, and ML models.",
    icon: "Bot",
    order: 3,
  },
  {
    name: "Design & UX",
    slug: "design",
    description: "UI/UX design, design systems, interface aesthetics, and user research",
    color: "#ec4899",
    metaTitle: "UI/UX & Product Design Insights | Mindful Blog",
    metaDescription: "Articles on crafting clear interfaces, design tokens, typography, and user experiences.",
    icon: "Palette",
    order: 4,
  },
  {
    name: "Cloud & DevOps",
    slug: "cloud-devops",
    description: "Cloud infrastructure, Docker, CI/CD, Kubernetes, and system reliability",
    color: "#06b6d4",
    metaTitle: "Cloud Computing & DevOps Practices | Mindful Blog",
    metaDescription: "Learn how to build, deploy, and scale resilient cloud infrastructure.",
    icon: "Cloud",
    order: 5,
  },
  {
    name: "Cybersecurity",
    slug: "cybersecurity",
    description: "Web security, authentication, encryption, and best practices for safe software",
    color: "#ef4444",
    metaTitle: "Web & System Security Guides | Mindful Blog",
    metaDescription: "Stay ahead of security threats with guides on authentication, API safety, and data protection.",
    icon: "ShieldAlert",
    order: 6,
  },
  {
    name: "Productivity & Career",
    slug: "productivity",
    description: "Developer workflows, focus techniques, career growth, and calm engineering",
    color: "#10b981",
    metaTitle: "Developer Productivity & Career Growth | Mindful Blog",
    metaDescription: "Tips for staying focused, building sustainable habits, and navigating a tech career.",
    icon: "Zap",
    order: 7,
  },
];

export async function runCategorySeed() {
  console.log("📚 Running Category Seed...");

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug },
    });

    if (existing) {
      console.log(`⏭️ Category already exists: ${cat.name}`);
      continue;
    }

    const createdCategory = await prisma.category.create({
      data: {
        id: crypto.randomUUID(),
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        color: cat.color,
        metaTitle: cat.metaTitle,
        metaDescription: cat.metaDescription,
        icon: cat.icon,
        order: cat.order,
        status: "ACTIVE",
        isDeleted: false,
      },
    });

    console.log(`➕ Created category: ${createdCategory.name}`);
  }

  console.log("🎉 Category seed completed");
}
