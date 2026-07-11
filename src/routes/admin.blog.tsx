import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  listBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/admin-data.functions";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, TextAreaField } from "@/components/admin/fields";
import { Loader2, Pencil, Plus, Trash2, X, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/blog")({
  head: () => ({
    meta: [
      { title: "Блог — EraPay Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell title="Блог">
      <BlogPanel />
    </AdminShell>
  ),
});

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  meta_title: string;
  meta_description: string;
  keyword: string;
  author_name: string;
  cover_emoji: string;
  published: boolean;
  published_at: string;
};

function emptyRow(): BlogRow {
  return {
    id: "",
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    category: "",
    meta_title: "",
    meta_description: "",
    keyword: "",
    author_name: "Дмитрий Соколовский",
    cover_emoji: "📝",
    published: true,
    published_at: new Date().toISOString(),
  };
}

function BlogPanel() {
  const [rows, setRows] = useState<BlogRow[] | null>(null);
  const [editing, setEditing] = useState<BlogRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [q, setQ] = useState("");

  const fetchList = useServerFn(listBlogPosts);
  const runUpdate = useServerFn(updateBlogPost);
  const runDelete = useServerFn(deleteBlogPost);

  async function load() {
    setRows(null);
    try {
      const data = await fetchList();
      setRows((data as BlogRow[]) ?? []);
    } catch (e) {
      console.error("listBlogPosts failed", e);
      setRows([]);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function togglePublished(row: BlogRow) {
    await runUpdate({ data: { id: row.id, patch: { published: !row.published } } });
    load();
  }

  async function remove(row: BlogRow) {
    if (!confirm(`Удалить статью «${row.slug}»?`)) return;
    await runDelete({ data: { id: row.id } });
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
          <Plus className="h-4 w-4" /> Новая статья
        </button>
      </div>

      {rows === null ? (
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-xs uppercase text-slate-600">
              <tr>
                <th className="px-3 py-2">Emoji</th>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Заголовок</th>
                <th className="px-3 py-2">Категория</th>
                <th className="px-3 py-2">Статус</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2 text-xl">{r.cover_emoji}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-600">{r.slug}</td>
                  <td className="px-3 py-2">{r.title}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">{r.category}</td>
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
        <BlogDialog
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
      {creating && (
        <BlogDialog
          initial={emptyRow()}
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

function BlogDialog({
  initial,
  onClose,
  onSaved,
  isNew,
}: {
  initial: BlogRow;
  onClose: () => void;
  onSaved: () => void;
  isNew?: boolean;
}) {
  const [form, setForm] = useState<BlogRow>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const runCreate = useServerFn(createBlogPost);
  const runUpdate = useServerFn(updateBlogPost);

  function set<K extends keyof BlogRow>(field: K, value: BlogRow[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const { id: _id, ...insert } = form;
        void _id;
        await runCreate({ data: { row: insert } });
      } else {
        const { id, ...rest } = form;
        await runUpdate({ data: { id, patch: rest } });
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
            {isNew ? "Новая статья" : `Редактирование: ${form.slug}`}
          </h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Slug" value={form.slug} onChange={(v) => set("slug", v)} />
          <Field label="Cover emoji" value={form.cover_emoji} onChange={(v) => set("cover_emoji", v)} />
          <div className="sm:col-span-2">
            <Field label="Заголовок (title)" value={form.title} onChange={(v) => set("title", v)} />
          </div>
          <Field label="Категория" value={form.category} onChange={(v) => set("category", v)} />
          <Field label="Автор" value={form.author_name} onChange={(v) => set("author_name", v)} />
          <div className="sm:col-span-2">
            <TextAreaField
              label="Краткое описание (excerpt)"
              value={form.excerpt}
              onChange={(v) => set("excerpt", v)}
              rows={3}
            />
          </div>
          <div className="sm:col-span-2">
            <TextAreaField
              label="Полный текст (HTML)"
              value={form.content}
              onChange={(v) => set("content", v)}
              rows={16}
            />
          </div>
          <div className="sm:col-span-2">
            <Field label="Meta title" value={form.meta_title} onChange={(v) => set("meta_title", v)} />
          </div>
          <div className="sm:col-span-2">
            <TextAreaField
              label="Meta description"
              value={form.meta_description}
              onChange={(v) => set("meta_description", v)}
              rows={2}
            />
          </div>
          <Field label="Keyword" value={form.keyword} onChange={(v) => set("keyword", v)} />
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Дата публикации
            </label>
            <input
              type="datetime-local"
              value={
                form.published_at
                  ? new Date(form.published_at).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                set(
                  "published_at",
                  e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString(),
                )
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 pt-4 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.published}
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