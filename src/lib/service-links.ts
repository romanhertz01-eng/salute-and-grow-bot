import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PublishedService = { slug: string; name: string };

export const publishedServicesQueryOptions = (slugs: readonly string[]) =>
  queryOptions({
    queryKey: ["service_pages", "published-in", [...slugs].sort()],
    queryFn: async (): Promise<PublishedService[]> => {
      if (slugs.length === 0) return [];
      const { data, error } = await supabase
        .from("service_pages" as never)
        .select("slug,name")
        .eq("published", true)
        .in("slug", slugs as string[]);
      if (error) throw error;
      const rows = (data as PublishedService[] | null) ?? [];
      // preserve caller order
      const map = new Map(rows.map((r) => [r.slug, r]));
      return slugs.map((s) => map.get(s)).filter((r): r is PublishedService => Boolean(r));
    },
  });
