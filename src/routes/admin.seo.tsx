import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, NumField, TextAreaField } from "@/components/admin/fields";
import { Loader2, Pencil, Plus, Trash2, X, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/seo")({
  head: () => ({
    meta: [
      { title: "SEO-страницы — EraPay Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell title="SEO-страницы">
      <SeoPanel />
    </AdminShell>
  ),
});

type TabKey = "service_pages" | "country_pages" | "guide_pages";

type Row = Record<string, unknown> & {
  id: string;
  slug: string;
  h1: string;
  meta_title: string;
  meta_description: string;
  keyword: string;
  priority: number;
  published: boolean;
};

const TABS: { key: TabKey; label: string; extra: { label: string; field: string; type?: "text" | "textarea" }[] }[] = [
  {
    key: "service_pages",
    label: "Сервисы",
    extra: [
      { label: "Название сервиса", field: "name" },
      { label: "Категория", field: "category" },
      { label: "Intro (вводный текст)", field: "intro_text", type: "textarea" },
    ],
  },
  {
    key: "country_pages",
    label: "Страны",
    extra: [
      { label: "Название (ru)", field: "name_ru" },
      { label: "Название (en)", field: "name_en" },
      { label: "Валюта", field: "currency" },
      { label: "Регион", field: "region" },
      { label: "Флаг", field: "flag_emoji" },
      { label: "Intro (вводный текст)", field: "intro_text", type: "textarea" },
    ],
  },
  {
    key: "guide_pages",
    label: "Гайды",
    extra: [
      { label: "Тип (service/country)", field: "guide_type" },
      { label: "Target name", field: "target_name" },
      { label: "Related slug", field: "related_slug" },
    ],
  },
];

function SeoPanel() {
  const [tab, setTab] = useState<TabKey>("service_pages");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [q, setQ] = useState("");

  async function load() {
    setRows(null);
    const { data } = await supabase.from(tab).select("*").order("slug");
    setRows((data as Row[] | null) ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function togglePublished(row: Row) {
    await supabase.from(tab).update({ published: !row.published }).eq("id", row.id);
    load();
  }

  async function remove(row: Row) {
    if (!confirm(`Удалить «${row.slug}»?`)) return;
    await supabase.from(tab).delete().eq("id", row.id);
    load();
  }

  const tabConfig = TABS.find((t) => t.key === tab)!;
  const filtered = (rows ?? []).filter(
    (r) => !q || String(r.slug).includes(q) || String(r.h1).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              tab === t.key ? "border-slate-900 bg-slate-900 text-white" : "bg-white hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
        <div className="flex-1" />
        <input
          placeholder="Поиск по slug / h1"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-64 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> Новая
        </button>
      </div>

      {rows === null ? (
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-xs uppercase text-slate-600">
              <tr>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">H1</th>
                <th className="px-3 py-2">Опубликовано</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2 font-mono text-xs text-slate-600">{r.slug}</td>
                  <td className="px-3 py-2">{r.h1}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => togglePublished(r)}
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ${
                        r.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {r.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {r.published ? "Опубликовано" : "Скрыто"}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => setEditing(r)}
                      className="mr-2 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-slate-100"
                    >
                      <Pencil className="h-3 w-3" /> Изменить
                    </button>
                    <button
                      onClick={() => remove(r)}
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
      )}

      {editing && (
        <SeoDialog
          table={tab}
          config={tabConfig}
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
      {creating && (
        <SeoDialog
          table={tab}
          config={tabConfig}
          initial={emptyRow(tab)}
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

function emptyRow(tab: TabKey): Row {
  const base: Row = {
    id: "",
    slug: "",
    h1: "",
    meta_title: "",
    meta_description: "",
    keyword: "",
    priority: 2,
    published: true,
  };
  if (tab === "service_pages") return { ...base, name: "", category: "", intro_text: "" };
  if (tab === "country_pages")
    return {
      ...base,
      name_ru: "",
      name_en: "",
      currency: "",
      region: "",
      flag_emoji: "",
      intro_text: "",
    };
  return { ...base, guide_type: "service", target_name: "", related_slug: "" };
}

function SeoDialog({
  table,
  config,
  initial,
  onClose,
  onSaved,
  isNew,
}: {
  table: TabKey;
  config: (typeof TABS)[number];
  initial: Row;
  onClose: () => void;
  onSaved: () => void;
  isNew?: boolean;
}) {
  const [form, setForm] = useState<Row>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    if (isNew) {
      const { id: _id, ...insert } = form;
      void _id;
      const { error: e } = await supabase.from(table).insert(insert as never);
      if (e) setError(e.message);
      else onSaved();
    } else {
      const { id, ...rest } = form;
      const { error: e } = await supabase.from(table).update(rest as never).eq("id", id);
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
            {isNew ? `Новая запись: ${config.label}` : `Редактирование: ${form.slug}`}
          </h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Slug" value={String(form.slug ?? "")} onChange={(v) => set("slug", v)} />
          <Field label="Keyword" value={String(form.keyword ?? "")} onChange={(v) => set("keyword", v)} />
          <div className="sm:col-span-2">
            <Field label="H1" value={String(form.h1 ?? "")} onChange={(v) => set("h1", v)} />
          </div>
          <div className="sm:col-span-2">
            <Field label="Meta title" value={String(form.meta_title ?? "")} onChange={(v) => set("meta_title", v)} />
          </div>
          <div className="sm:col-span-2">
            <TextAreaField
              label="Meta description"
              value={String(form.meta_description ?? "")}
              onChange={(v) => set("meta_description", v)}
            />
          </div>
          {config.extra.map((f) => {
            const val = String((form as Record<string, unknown>)[f.field] ?? "");
            if (f.type === "textarea") {
              return (
                <div key={f.field} className="sm:col-span-2">
                  <TextAreaField label={f.label} value={val} onChange={(v) => set(f.field, v)} rows={4} />
                </div>
              );
            }
            return <Field key={f.field} label={f.label} value={val} onChange={(v) => set(f.field, v)} />;
          })}
          <NumField label="Priority" value={Number(form.priority ?? 2)} onChange={(v) => set("priority", v)} />
          <label className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              checked={Boolean(form.published)}
              onChange={(e) => set("published", e.target.checked)}
            />
            <span className="text-sm text-slate-700">Опубликовано</span>
          </label>
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