import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type SeoTable = "service_pages" | "country_pages" | "guide_pages";

const SEO_TABLES: SeoTable[] = ["service_pages", "country_pages", "guide_pages"];

function assertSeoTable(t: string): asserts t is SeoTable {
  if (!SEO_TABLES.includes(t as SeoTable)) throw new Error("Invalid table");
}

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [cards, services, countries, guides, pending] = await Promise.all([
      supabaseAdmin.from("cards").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("service_pages").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("country_pages").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("guide_pages").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);

    return {
      cards: cards.count ?? 0,
      services: services.count ?? 0,
      countries: countries.count ?? 0,
      guides: guides.count ?? 0,
      pending: pending.count ?? 0,
    };
  });

export const listSeoPages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string }) => {
    assertSeoTable(data.table);
    return { table: data.table as SeoTable };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from(data.table)
      .select("*")
      .order("slug");
    if (error) throw new Error(error.message);
    return (rows ?? []) as Array<Record<string, unknown>>;
  });

export const updateSeoPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string; id: string; patch: Record<string, unknown> }) => {
    assertSeoTable(data.table);
    if (!data.id) throw new Error("id required");
    return { table: data.table as SeoTable, id: data.id, patch: data.patch };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from(data.table)
      .update(data.patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSeoPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string; id: string }) => {
    assertSeoTable(data.table);
    if (!data.id) throw new Error("id required");
    return { table: data.table as SeoTable, id: data.id };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createSeoPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string; row: Record<string, unknown> }) => {
    assertSeoTable(data.table);
    return { table: data.table as SeoTable, row: data.row };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from(data.table).insert(data.row as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });