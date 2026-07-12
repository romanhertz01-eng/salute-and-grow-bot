import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  listTopicPages,
  createTopicPage,
  updateTopicPage,
  deleteTopicPage,
} from "@/lib/topic-pages.functions";
import { Field, TextAreaField, NumField, BoolField } from "@/components/admin/fields";
import { Loader2, Pencil, Plus, Trash2, X, Eye, EyeOff, ExternalLink } from "lucide-react";

type Row = {
  id: string;
  slug: string;
  title: string;
  h1: string;
  meta_title: string;
  meta_description: string;
  keyword: string;
  intro_text: string;
  content: string;
  partner_url: string;
  priority: number;
  published: boolean;
};

function empty(): Row {
  return {
    id: "",
    slug: "",
    title: "",
    h1: "",
    meta_title: "",
    meta_description: "",
    keyword: "",
    intro_text: "",
    content: "",
    partner_url: "",
    priority: 0,
    published: true,
  };
}

export function TopicAdminPanel({ table, label }: { table: "crypto_pages" | "ai_pages"; label: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [q, setQ] = useState("");

  const fetchList = useServerFn(listTopicPages);
  const runUpdate = useServerFn(updateTopicPage);
  const runDelete = useServerFn(deleteTopicPage);

  async function load() {
    setRows(null);
    try {
      const data = await fetchList({ data: { table } });
      setRows((data as Row[]) ?? []);
    } catch (e) {
      console.error("listTopicPages failed", e);
      setRows([]);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  async function togglePublished(row: Row) {
    await runUpdate({ data: { table, id: row.id, patch: { published: !row.published } } });
    load();
  }

  async function remove(row: Row) {
    if (!confirm(`Удалить страницу «${row.slug}»?`)) return;
    await runDelete({ data: { table, id: row.id } });
    load();
  }

  const filtered = (rows ?? []).filter(
    (r) => !q || r.slug.includes(q) || r.title.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex-1" />
        <input
          placeholder="Поиск по slug / заголовку"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-64 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> Новая страница ({label})
        </button>
      </div>

      {rows === null ? (
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-xs uppercase text-slate-600">
              <tr>
                <th className="px-3 py-2">Приоритет</th>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Заголовок</th>
                <th className="px-3 py-2">Партнёр</th>
                <th className="px-3 py-2">Статус</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2 text-slate-600">{r.priority}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-600">{r.slug}</td>
                  <td className="px-3 py-2">{r.title}</td>
                  <td className="px-3 py-2">
                    {r.partner_url ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                        <ExternalLink className="h-3 w-3" /> есть
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">— пусто</span>
                    )}
                  </td>
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
        <TopicDialog
          table={table}
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
      {creating && (
        <TopicDialog
          table={table}
          initial={empty()}
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

function TopicDialog({
  table,
  initial,
  onClose,
  onSaved,
  isNew,
}: {
  table: "crypto_pages" | "ai_pages";
  initial: Row;
  onClose: () => void;
  onSaved: () => void;
  isNew?: boolean;
}) {
  const [form, setForm] = useState<Row>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const runCreate = useServerFn(createTopicPage);
  const runUpdate = useServerFn(updateTopicPage);

  function set<K extends keyof Row>(field: K, value: Row[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const { id: _id, ...insert } = form;
        void _id;
        await runCreate({ data: { table, row: insert } });
      } else {
        const { id, ...rest } = form;
        await runUpdate({ data: { table, id, patch: rest } });
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-8 w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">
            {isNew ? "Новая страница" : `Редактирование: ${form.slug}`}
          </h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Slug" value={form.slug} onChange={(v) => set("slug", v)} />
          <NumField label="Приоритет" value={form.priority} onChange={(v) => set("priority", v)} />
          <div className="sm:col-span-2">
            <Field label="Title" value={form.title} onChange={(v) => set("title", v)} />
          </div>
          <div className="sm:col-span-2">
            <Field label="H1" value={form.h1} onChange={(v) => set("h1", v)} />
          </div>
          <div className="sm:col-span-2">
            <TextAreaField
              label="Intro (лид)"
              value={form.intro_text}
              onChange={(v) => set("intro_text", v)}
              rows={3}
            />
          </div>
          <div className="sm:col-span-2">
            <TextAreaField
              label="Content (HTML)"
              value={form.content}
              onChange={(v) => set("content", v)}
              rows={14}
            />
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Partner URL (пусто = «Ссылка скоро появится»)"
              value={form.partner_url}
              onChange={(v) => set("partner_url", v)}
            />
          </div>
          <Field label="Meta title" value={form.meta_title} onChange={(v) => set("meta_title", v)} />
          <Field label="Keyword" value={form.keyword} onChange={(v) => set("keyword", v)} />
          <div className="sm:col-span-2">
            <TextAreaField
              label="Meta description"
              value={form.meta_description}
              onChange={(v) => set("meta_description", v)}
              rows={2}
            />
          </div>
          <BoolField label="Опубликовано" value={form.published} onChange={(v) => set("published", v)} />
        </div>
        {error && <div className="mt-3 rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div>}
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-4 py-2 text-sm hover:bg-slate-100">
            Отмена
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}