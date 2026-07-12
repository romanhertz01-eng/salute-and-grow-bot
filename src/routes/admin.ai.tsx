import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { TopicAdminPanel } from "@/components/admin/TopicAdminPanel";

export const Route = createFileRoute("/admin/ai")({
  head: () => ({
    meta: [
      { title: "Нейросети — EraPay Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell title="Нейросети">
      <TopicAdminPanel table="ai_pages" label="нейросеть" />
    </AdminShell>
  ),
});