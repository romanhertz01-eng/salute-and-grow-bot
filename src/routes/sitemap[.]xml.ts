import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const BASE_URL = "https://erapay.ru";

type Entry = {
  path: string;
  lastmod: string;
  changefreq: "weekly";
  priority: string;
};

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);

        const supabase = createClient<Database>(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          {
            auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
          },
        );

        const entries: Entry[] = [
          { path: "/", lastmod: today, changefreq: "weekly", priority: "1.0" },
        ];

        const [cardsRes, servicesRes, countriesRes, guidesRes] = await Promise.all([
          supabase.from("cards").select("slug"),
          supabase.from("service_pages").select("slug").eq("published", true),
          supabase.from("country_pages" as never).select("slug").eq("published", true),
          supabase.from("guide_pages" as never).select("slug").eq("published", true),
        ]);

        for (const row of cardsRes.data ?? []) {
          if (!row.slug) continue;
          entries.push({
            path: `/cards/${row.slug}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.7",
          });
        }

        for (const row of servicesRes.data ?? []) {
          if (!row.slug) continue;
          entries.push({
            path: `/service/${row.slug}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.8",
          });
        }

        for (const row of (countriesRes.data ?? []) as { slug: string | null }[]) {
          if (!row.slug) continue;
          entries.push({
            path: `/country/${row.slug}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.8",
          });
        }

        for (const row of (guidesRes.data ?? []) as { slug: string | null }[]) {
          if (!row.slug) continue;
          entries.push({
            path: `/guides/${row.slug}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.6",
          });
        }

        const urls = entries
          .map((e) =>
            [
              `  <url>`,
              `    <loc>${xmlEscape(BASE_URL + e.path)}</loc>`,
              `    <lastmod>${e.lastmod}</lastmod>`,
              `    <changefreq>${e.changefreq}</changefreq>`,
              `    <priority>${e.priority}</priority>`,
              `  </url>`,
            ].join("\n"),
          )
          .join("\n");

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});