import { prisma } from "./client";

const tags = [
  {
    name: "react",
    slug: "react",
    color: "#61dafb",
    description: "React ecosystem & components",
  },
  {
    name: "nextjs",
    slug: "nextjs",
    color: "#000000",
    description: "Next.js App Router & SSR",
  },
  {
    name: "typescript",
    slug: "typescript",
    color: "#3178c6",
    description: "Type-safe JavaScript",
  },
  {
    name: "javascript",
    slug: "javascript",
    color: "#f7df1e",
    description: "Modern JavaScript (ESNext)",
  },
  {
    name: "nodejs",
    slug: "nodejs",
    color: "#3c873a",
    description: "Node.js server environment",
  },
  {
    name: "express",
    slug: "express",
    color: "#444444",
    description: "Express framework",
  },
  {
    name: "prisma",
    slug: "prisma",
    color: "#0c344b",
    description: "Prisma ORM & PostgreSQL",
  },
  {
    name: "mongodb",
    slug: "mongodb",
    color: "#4db33d",
    description: "NoSQL document database",
  },
  {
    name: "postgresql",
    slug: "postgresql",
    color: "#336791",
    description: "Relational database engine",
  },
  {
    name: "mysql",
    slug: "mysql",
    color: "#00758f",
    description: "MySQL database",
  },
  {
    name: "tailwind",
    slug: "tailwind",
    color: "#38bdf8",
    description: "Tailwind CSS styling",
  },
  {
    name: "css",
    slug: "css",
    color: "#264de4",
    description: "Cascading Style Sheets",
  },
  {
    name: "html",
    slug: "html",
    color: "#e34c26",
    description: "HTML5 semantic markup",
  },
  {
    name: "ui-ux",
    slug: "ui-ux",
    color: "#8b5cf6",
    description: "User Interface & Experience",
  },
  {
    name: "design",
    slug: "design",
    color: "#ec4899",
    description: "Product design & tokens",
  },
  {
    name: "api",
    slug: "api",
    color: "#10b981",
    description: "API design & integration",
  },
  {
    name: "rest-api",
    slug: "rest-api",
    color: "#059669",
    description: "RESTful architecture",
  },
  {
    name: "graphql",
    slug: "graphql",
    color: "#e535ab",
    description: "GraphQL schema & queries",
  },
  {
    name: "authentication",
    slug: "authentication",
    color: "#f43f5e",
    description: "User auth & sessions",
  },
  {
    name: "security",
    slug: "security",
    color: "#dc2626",
    description: "Application security",
  },
  {
    name: "devops",
    slug: "devops",
    color: "#0ea5e9",
    description: "CI/CD & infrastructure",
  },
  {
    name: "docker",
    slug: "docker",
    color: "#2496ed",
    description: "Docker containers",
  },
  {
    name: "aws",
    slug: "aws",
    color: "#ff9900",
    description: "Amazon Web Services",
  },
  {
    name: "cloud",
    slug: "cloud",
    color: "#6366f1",
    description: "Cloud computing",
  },
  {
    name: "linux",
    slug: "linux",
    color: "#f97316",
    description: "Linux sysadmin & bash",
  },
  {
    name: "mobile",
    slug: "mobile",
    color: "#14b8a6",
    description: "Mobile application dev",
  },
  {
    name: "react-native",
    slug: "react-native",
    color: "#61dafb",
    description: "React Native framework",
  },
  {
    name: "flutter",
    slug: "flutter",
    color: "#02569b",
    description: "Flutter cross-platform",
  },
  {
    name: "ai",
    slug: "ai",
    color: "#a855f7",
    description: "Artificial Intelligence",
  },
  {
    name: "machine-learning",
    slug: "machine-learning",
    color: "#7c3aed",
    description: "Machine learning models",
  },
  {
    name: "python",
    slug: "python",
    color: "#3776ab",
    description: "Python programming language",
  },
  {
    name: "system-design",
    slug: "system-design",
    color: "#f59e0b",
    description: "Large-scale system design",
  },
  {
    name: "kubernetes",
    slug: "kubernetes",
    color: "#326ce5",
    description: "Container orchestration",
  },
  {
    name: "web-performance",
    slug: "web-performance",
    color: "#10b981",
    description: "Web Vitals & speed optimization",
  },
];

export async function runTagSeed() {
  console.log("🏷️ Running Tag Seed...");

  for (const tag of tags) {
    const existing = await prisma.tag.findUnique({
      where: { slug: tag.slug },
    });

    if (existing) {
      console.log(`⏭️ Tag already exists: ${tag.name}`);
      continue;
    }

    await prisma.tag.create({
      data: {
        id: crypto.randomUUID(),
        name: tag.name,
        slug: tag.slug,
        color: tag.color,
        description: tag.description,
        isDeleted: false,
      },
    });

    console.log(`➕ Created tag: ${tag.name}`);
  }

  console.log("🎉 Tag seed completed");
}
