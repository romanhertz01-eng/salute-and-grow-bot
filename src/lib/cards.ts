import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { queryOptions } from "@tanstack/react-query";

export type Card = Database["public"]["Tables"]["cards"]["Row"];

export const cardsQueryOptions = queryOptions({
  queryKey: ["cards"],
  queryFn: async (): Promise<Card[]> => {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .order("rank", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const cardBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["cards", slug],
    queryFn: async (): Promise<Card | null> => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatToday(): string {
  const d = new Date();
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}