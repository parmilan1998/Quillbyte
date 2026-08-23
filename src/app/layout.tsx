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

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://quilbyte.vercel.app";
const siteName = "Quillbyte";
const siteDescription =
  "A modern publication for practical engineering, product, and technology writing.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: `${siteName} | Ideas worth shipping`,
    template: `%s | ${siteName}`,
  },

  description: siteDescription,

  applicationName: siteName,

  keywords: [
    siteName,
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
      name: `${siteName} Team`,
      url: siteUrl,
    },
  ],

  creator: siteName,

  publisher: siteName,

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
    title: `${siteName} | Ideas worth shipping`,
    description: siteDescription,

    url: siteUrl,

    siteName,

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/social-card.svg",
        width: 1200,
        height: 630,
        alt: "Quillbyte - Ideas worth shipping",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    creator: "@quillbyte",
    site: "@quillbyte",

    images: ["/social-card.svg"],
  },

  icons: {
    icon: ["/icon.svg", "/icon.svg"],
    apple: "/icon.svg",
  },

  manifest: "/site.webmanifest",
  other: {
    "geo.region": "US",
    "geo.placename": "Remote-first publication",
    "content-language": "en-US",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      description: siteDescription,
      sameAs: ["https://twitter.com/quillbyte", "https://github.com/quillbyte"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
