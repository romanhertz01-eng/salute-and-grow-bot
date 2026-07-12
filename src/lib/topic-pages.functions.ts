import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type TopicTable = "crypto_pages" | "ai_pages";

function assertTopicTable(t: string): asserts t is TopicTable {
  if (t !== "crypto_pages" && t !== "ai_pages") throw new Error("Invalid table");
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

export const listTopicPages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string }) => {
    assertTopicTable(data.table);
    return { table: data.table as TopicTable };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from(data.table as never)
      .select("*")
      .order("priority", { ascending: false });
    if (error) throw new Error(error.message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (rows ?? []) as any[];
  });

export const createTopicPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string; row: Record<string, unknown> }) => {
    assertTopicTable(data.table);
    return { table: data.table as TopicTable, row: data.row };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from(data.table as never).insert(data.row as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateTopicPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string; id: string; patch: Record<string, unknown> }) => {
    assertTopicTable(data.table);
    if (!data.id) throw new Error("id required");
    return { table: data.table as TopicTable, id: data.id, patch: data.patch };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from(data.table as never)
      .update(data.patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTopicPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string; id: string }) => {
    assertTopicTable(data.table);
    if (!data.id) throw new Error("id required");
    return { table: data.table as TopicTable, id: data.id };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from(data.table as never).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });