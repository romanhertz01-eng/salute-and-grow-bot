import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const BASE_URL = "https://erapay.ru";
const STATIC_DATE = "2026-07-01";
const clip = (d: string | null | undefined) => (d ? d.slice(0, 10) : STATIC_DATE);

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
        const supabase = createClient<Database>(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          {
            auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
          },
        );

        const entries: Entry[] = [
          { path: "/", lastmod: STATIC_DATE, changefreq: "weekly", priority: "1.0" },
        ];

        const landingPaths = ["/foreign-virtual-cards", "/cards-for-subscriptions", "/travel-cards"];
        for (const p of landingPaths) {
          entries.push({ path: p, lastmod: STATIC_DATE, changefreq: "weekly", priority: "0.9" });
        }

        const infoPaths = [
          "/about",
          "/methodology",
          "/partners",
          "/editorial-policy",
          "/affiliate-disclosure",
          "/legal/terms",
          "/legal/privacy",
        ];
        for (const p of infoPaths) {
          entries.push({ path: p, lastmod: STATIC_DATE, changefreq: "weekly", priority: "0.4" });
        }

        const [cardsRes, servicesRes, countriesRes, guidesRes] = await Promise.all([
          supabase.from("cards").select("slug, last_checked"),
          supabase.from("service_pages").select("slug, updated_at").eq("published", true),
          supabase.from("country_pages" as never).select("slug, updated_at").eq("published", true),
          supabase.from("guide_pages" as never).select("slug, updated_at").eq("published", true),
        ]);

        const blogRes = await supabase
          .from("blog_posts" as never)
          .select("slug, published_at, updated_at")
          .eq("published", true);

        const banksRes = await supabase
          .from("bank_pages")
          .select("slug, updated_at")
          .eq("published", true);

        entries.push({
          path: "/blog",
          lastmod: STATIC_DATE,
          changefreq: "weekly",
          priority: "0.7",
        });

        for (const row of (blogRes.data ?? []) as {
          slug: string | null;
          published_at: string | null;
          updated_at: string | null;
        }[]) {
          if (!row.slug) continue;
          entries.push({
            path: `/blog/${row.slug}`,
            lastmod: clip(row.published_at ?? row.updated_at),
            changefreq: "weekly",
            priority: "0.6",
          });
        }

        entries.push({
          path: "/banks",
          lastmod: STATIC_DATE,
          changefreq: "weekly",
          priority: "0.7",
        });
        for (const row of (banksRes.data ?? []) as { slug: string | null; updated_at: string | null }[]) {
          if (!row.slug) continue;
          entries.push({
            path: `/banks/${row.slug}`,
            lastmod: clip(row.updated_at),
            changefreq: "weekly",
            priority: "0.6",
          });
        }

        for (const row of (cardsRes.data ?? []) as { slug: string | null; last_checked: string | null }[]) {
          if (!row.slug) continue;
          entries.push({
            path: `/cards/${row.slug}`,
            lastmod: clip(row.last_checked),
            changefreq: "weekly",
            priority: "0.7",
          });
        }

        for (const row of (servicesRes.data ?? []) as { slug: string | null; updated_at: string | null }[]) {
          if (!row.slug) continue;
          entries.push({
            path: `/service/${row.slug}`,
            lastmod: clip(row.updated_at),
            changefreq: "weekly",
            priority: "0.8",
          });
        }

        for (const row of (countriesRes.data ?? []) as { slug: string | null; updated_at: string | null }[]) {
          if (!row.slug) continue;
          entries.push({
            path: `/country/${row.slug}`,
            lastmod: clip(row.updated_at),
            changefreq: "weekly",
            priority: "0.8",
          });
        }

        for (const row of (guidesRes.data ?? []) as { slug: string | null; updated_at: string | null }[]) {
          if (!row.slug) continue;
          entries.push({
            path: `/guides/${row.slug}`,
            lastmod: clip(row.updated_at),
            changefreq: "weekly",
            priority: "0.6",
          });
        }

        const [cryptoRes, aiRes] = await Promise.all([
          supabase.from("crypto_pages" as never).select("slug, updated_at").eq("published", true),
          supabase.from("ai_pages" as never).select("slug, updated_at").eq("published", true),
        ]);

        entries.push({ path: "/crypto", lastmod: STATIC_DATE, changefreq: "weekly", priority: "0.7" });
        for (const row of (cryptoRes.data ?? []) as { slug: string | null; updated_at: string | null }[]) {
          if (!row.slug) continue;
          entries.push({
            path: `/crypto/${row.slug}`,
            lastmod: clip(row.updated_at),
            changefreq: "weekly",
            priority: "0.6",
          });
        }

        entries.push({ path: "/ai", lastmod: STATIC_DATE, changefreq: "weekly", priority: "0.7" });
        for (const row of (aiRes.data ?? []) as { slug: string | null; updated_at: string | null }[]) {
          if (!row.slug) continue;
          entries.push({
            path: `/ai/${row.slug}`,
            lastmod: clip(row.updated_at),
            changefreq: "weekly",
            priority: "0.6",
          });
        }

        entries.push({ path: "/network", lastmod: STATIC_DATE, changefreq: "weekly", priority: "0.6" });
        entries.push({ path: "/network/visa", lastmod: STATIC_DATE, changefreq: "weekly", priority: "0.7" });
        entries.push({ path: "/network/mastercard", lastmod: STATIC_DATE, changefreq: "weekly", priority: "0.7" });

        for (const row of (cardsRes.data ?? []) as { slug: string | null; last_checked: string | null }[]) {
          if (!row.slug) continue;
          entries.push({
            path: `/cards/${row.slug}/reviews`,
            lastmod: clip(row.last_checked),
            changefreq: "weekly",
            priority: "0.5",
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
