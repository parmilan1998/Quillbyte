import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quillbyte",
    short_name: "Quillbyte",
    description:
      "Modern Blogging Platform for Programming, AI and Software Engineering",

    start_url: "/",

    display: "standalone",

    background_color: "#ffffff",

    theme_color: "#147d78",

    orientation: "portrait",

    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
