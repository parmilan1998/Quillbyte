import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/providers";
import { Suspense } from "react";
import { TopProgressBar } from "@/components/ui/page-loader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://quillbyte.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Quillbyte | Ideas worth shipping",
    template: "%s | Quillbyte",
  },

  description:
    "Quillbyte is a modern publication for thoughtful engineering, product, and technology writing.",

  applicationName: "Quillbyte",

  keywords: [
    "Quillbyte",
    "Blog",
    "Programming",
    "Software Engineering",
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "Artificial Intelligence",
    "Web Development",
    "Backend Development",
    "Frontend Development",
    "Node.js",
    "NestJS",
    "Express",
    "Tech Articles",
    "Developer Blog",
    "Coding Tutorials",
  ],

  authors: [
    {
      name: "Quillbyte Team",
      url: siteUrl,
    },
  ],

  creator: "Quillbyte",

  publisher: "Quillbyte",

  category: "Technology",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: "Quillbyte | Ideas worth shipping",
    description:
      "Explore high-quality articles about programming, AI, software engineering, and modern web development.",

    url: siteUrl,

    siteName: "Quillbyte",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/icon.svg",
        width: 1200,
        height: 630,
        alt: "Quillbyte publication",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Quillbyte",
    description:
      "Modern programming tutorials, AI articles, and software engineering blogs.",

    images: ["/icon.svg"],
  },

  icons: {
    icon: ["/icon.svg", "/icon.svg"],
    apple: "/icon.svg",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
