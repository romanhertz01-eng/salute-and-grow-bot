import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Check, X, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({
    meta: [
      { title: "Модерация отзывов — EraPay Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell title="Модерация отзывов">
      <ReviewsPanel />
    </AdminShell>
  ),
});

type Review = {
  id: string;
  author_name: string;
  card_slug: string;
  rating: number;
  text: string;
  status: string;
  created_at: string;
};

function ReviewsPanel() {
  const [filter, setFilter] = useState<"pending" | "published" | "rejected">("pending");
  const [items, setItems] = useState<Review[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setItems(null);
    const { data } = await supabase
      .from("reviews")
      .select("id, author_name, card_slug, rating, text, status, created_at")
      .eq("status", filter)
      .order("created_at", { ascending: false });
    setItems(data ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function updateStatus(id: string, status: "published" | "rejected") {
    setBusy(id);
    await supabase.from("reviews").update({ status }).eq("id", id);
    setItems((prev) => (prev ? prev.filter((r) => r.id !== id) : prev));
    setBusy(null);
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["pending", "published", "rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              filter === s ? "border-slate-900 bg-slate-900 text-white" : "bg-white hover:bg-slate-100"
            }`}
          >
            {s === "pending" ? "На модерации" : s === "published" ? "Опубликованные" : "Отклонённые"}
          </button>
        ))}
      </div>

      {items === null ? (
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      ) : items.length === 0 ? (
        <div className="rounded-md border bg-white p-6 text-sm text-slate-500">Пусто.</div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-baseline gap-2 text-sm">
                <span className="font-medium">{r.author_name}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">карта: {r.card_slug}</span>
                <span className="text-slate-400">•</span>
                <span className="text-amber-600">★ {r.rating}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">
                  {new Date(r.created_at).toLocaleString("ru-RU")}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{r.text}</p>
              {filter === "pending" && (
                <div className="mt-3 flex gap-2">
                  <button
                    disabled={busy === r.id}
                    onClick={() => updateStatus(r.id, "published")}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    <Check className="h-4 w-4" /> Одобрить
                  </button>
                  <button
                    disabled={busy === r.id}
                    onClick={() => updateStatus(r.id, "rejected")}
                    className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    <X className="h-4 w-4" /> Отклонить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}