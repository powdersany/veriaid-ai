import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/dashboard/*", "/analysis", "/api"],
      },
    ],
    sitemap: "https://veriaid.example.com/sitemap.xml",
  };
}
