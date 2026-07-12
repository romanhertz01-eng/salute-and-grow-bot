import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { DEMO_MODE } from "@/lib/config";

const BASE_URL = "https://erapay.ru";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const body = DEMO_MODE
          ? [
              "User-agent: *",
              "Disallow: /",
              "",
              `Sitemap: ${BASE_URL}/sitemap.xml`,
              "",
            ].join("\n")
          : [
              "User-agent: *",
              "Allow: /",
              "Disallow: /podbor",
              "Disallow: /admin",
              "",
              `Sitemap: ${BASE_URL}/sitemap.xml`,
              "",
            ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});