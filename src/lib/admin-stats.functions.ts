import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: isAdmin, error: roleErr } = await supabaseAdmin
      .rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (roleErr) throw new Error(roleErr.message);
    if (!isAdmin) throw new Error("Forbidden");

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