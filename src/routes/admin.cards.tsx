import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, NumField, BoolField } from "@/components/admin/fields";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/admin/cards")({
  head: () => ({
    meta: [
      { title: "Карты — EraPay Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell title="Карты">
      <CardsPanel />
    </AdminShell>
  ),
});

type CardRow = {
  id: string;
  slug: string;
  name: string;
  bank: string | null;
  rank: number;
  editorial_score: number;
  verified: boolean;
  is_ad: boolean;
  affiliate_url: string | null;
  issue_cost: string | null;
  service_cost: string | null;
  topup_fee: string | null;
  payment_system: string | null;
  monthly_limit: string | null;
  issue_speed: string | null;
  kyc: boolean;
};

const EMPTY: Omit<CardRow, "id"> = {
  slug: "",
  name: "",
  bank: "",
  rank: 99,
  editorial_score: 8,
  verified: false,
  is_ad: false,
  affiliate_url: "",
  issue_cost: "",
  service_cost: "",
  topup_fee: "",
  payment_system: "",
  monthly_limit: "",
  issue_speed: "",
  kyc: false,
};

function CardsPanel() {
  const [items, setItems] = useState<CardRow[] | null>(null);
  const [editing, setEditing] = useState<CardRow | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("cards")
      .select(
        "id, slug, name, bank, rank, editorial_score, verified, is_ad, affiliate_url, issue_cost, service_cost, topup_fee, payment_system, monthly_limit, issue_speed, kyc"
      )
      .order("rank");
    setItems((data as CardRow[] | null) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleVerified(row: CardRow) {
    await supabase.from("cards").update({ verified: !row.verified }).eq("id", row.id);
    load();
  }

  async function remove(row: CardRow) {
    if (!confirm(`Удалить карту «${row.name}»?`)) return;
    await supabase.from("cards").delete().eq("id", row.id);
    load();
  }

  if (items === null) return <Loader2 className="h-5 w-5 animate-spin text-slate-400" />;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> Новая карта
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs uppercase text-slate-600">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Название</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">Банк</th>
              <th className="px-3 py-2">Оценка</th>
              <th className="px-3 py-2">Verified</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-2">{c.rank}</td>
                <td className="px-3 py-2 font-medium">{c.name}</td>
                <td className="px-3 py-2 text-slate-500">{c.slug}</td>
                <td className="px-3 py-2">{c.bank ?? "—"}</td>
                <td className="px-3 py-2">{c.editorial_score}</td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={c.verified}
                    onChange={() => toggleVerified(c)}
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => setEditing(c)}
                    className="mr-2 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-slate-100"
                  >
                    <Pencil className="h-3 w-3" /> Изменить
                  </button>
                  <button
                    onClick={() => remove(c)}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" /> Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <CardDialog
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
      {creating && (
        <CardDialog
          initial={{ ...EMPTY, id: "" }}
          isNew
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function CardDialog({
  initial,
  onClose,
  onSaved,
  isNew,
}: {
  initial: CardRow;
  onClose: () => void;
  onSaved: () => void;
  isNew?: boolean;
}) {
  const [form, setForm] = useState<CardRow>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof CardRow>(key: K, v: CardRow[K]) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    const payload = { ...form };
    if (isNew) {
      const { id: _id, ...insert } = payload;
      void _id;
      const { error: e } = await supabase.from("cards").insert(insert);
      if (e) setError(e.message);
      else onSaved();
    } else {
      const { id, ...rest } = payload;
      const { error: e } = await supabase.from("cards").update(rest).eq("id", id);
      if (e) setError(e.message);
      else onSaved();
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-8 w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">
            {isNew ? "Новая карта" : `Редактирование: ${form.name}`}
          </h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Slug" value={form.slug} onChange={(v) => set("slug", v)} />
          <Field label="Название" value={form.name} onChange={(v) => set("name", v)} />
          <Field label="Банк" value={form.bank ?? ""} onChange={(v) => set("bank", v)} />
          <Field label="Платёжная система" value={form.payment_system ?? ""} onChange={(v) => set("payment_system", v)} />
          <NumField label="Rank" value={form.rank} onChange={(v) => set("rank", v)} />
          <NumField label="Оценка (0–10)" value={form.editorial_score} step={0.1} onChange={(v) => set("editorial_score", v)} />
          <Field label="Цена выпуска" value={form.issue_cost ?? ""} onChange={(v) => set("issue_cost", v)} />
          <Field label="Обслуживание" value={form.service_cost ?? ""} onChange={(v) => set("service_cost", v)} />
          <Field label="Комиссия пополнения" value={form.topup_fee ?? ""} onChange={(v) => set("topup_fee", v)} />
          <Field label="Лимит в месяц" value={form.monthly_limit ?? ""} onChange={(v) => set("monthly_limit", v)} />
          <Field label="Скорость выпуска" value={form.issue_speed ?? ""} onChange={(v) => set("issue_speed", v)} />
          <Field label="Affiliate URL" value={form.affiliate_url ?? ""} onChange={(v) => set("affiliate_url", v)} />
          <BoolField label="Verified" value={form.verified} onChange={(v) => set("verified", v)} />
          <BoolField label="Реклама (is_ad)" value={form.is_ad} onChange={(v) => set("is_ad", v)} />
          <BoolField label="KYC" value={form.kyc} onChange={(v) => set("kyc", v)} />
        </div>
        {error && <div className="mt-3 rounded-md bg-red-50 p-2 text-xs text-red-700">{error}</div>}
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-4 py-2 text-sm hover:bg-slate-100">
            Отмена
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Сохраняем…" : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}

