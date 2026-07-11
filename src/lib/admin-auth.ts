import { supabase } from "@/integrations/supabase/client";

/**
 * Returns true if the given user has the `admin` role.
 * Reads user_roles directly — RLS lets authenticated users read their own roles.
 * We intentionally do NOT call the `has_role` SECURITY DEFINER function from the
 * client (execute is revoked from anon/authenticated); it stays reserved for RLS.
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) return false;
  return Boolean(data);
}