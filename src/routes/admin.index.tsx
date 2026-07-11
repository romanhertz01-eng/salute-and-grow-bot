import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminStats } from "@/lib/admin-stats.functions";
import { CreditCard, FileText, Globe, BookOpen, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Админка — EraPay" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <AdminShell title="Дашборд">
      <Stats />
    </AdminShell>
  );
}

function Stats() {
  const [stats, setStats] = useState<{
    cards: number;
    services: number;
    countries: number;
    guides: number;
    pending: number;
  } | null>(null);
  const fetchStats = useServerFn(getAdminStats);

  useEffect(() => {
    (async () => {
      try {
        const s = await fetchStats();
        setStats(s);
      } catch (e) {
        console.error("admin stats failed", e);
      }
    })();
  }, [fetchStats]);

  const items = [
    { icon: CreditCard, label: "Карт", value: stats?.cards, color: "text-blue-600" },
    { icon: FileText, label: "Страниц сервисов", value: stats?.services, color: "text-emerald-600" },
    { icon: Globe, label: "Страниц стран", value: stats?.countries, color: "text-amber-600" },
    { icon: BookOpen, label: "Гайдов", value: stats?.guides, color: "text-indigo-600" },
    {
      icon: MessageSquare,
      label: "Отзывов на модерации",
      value: stats?.pending,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <div key={it.label} className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Icon className={`h-5 w-5 ${it.color}`} />
              <span className="text-sm text-slate-600">{it.label}</span>
            </div>
            <div className="mt-3 text-3xl font-semibold text-slate-900">
              {it.value ?? "…"}
            </div>
          </div>
        );
      })}
    </div>
  );
}