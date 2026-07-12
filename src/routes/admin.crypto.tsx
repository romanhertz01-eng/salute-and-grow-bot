import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { TopicAdminPanel } from "@/components/admin/TopicAdminPanel";

export const Route = createFileRoute("/admin/crypto")({
  head: () => ({
    meta: [
      { title: "Крипта — EraPay Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell title="Крипта">
      <TopicAdminPanel table="crypto_pages" label="крипта" />
    </AdminShell>
  ),
});