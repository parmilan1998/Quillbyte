import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quillbyte",
    short_name: "Quillbyte",
    description:
      "A modern publication for practical engineering, product, and technology writing.",

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
