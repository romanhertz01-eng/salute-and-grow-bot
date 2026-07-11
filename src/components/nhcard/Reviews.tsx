import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Review = Database["public"]["Tables"]["reviews"]["Row"];

function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function reviewsQueryOptions(slug: string) {
  return {
    queryKey: ["reviews", slug],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("card_slug", slug)
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  };
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Оценка ${value} из 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={n <= value ? "fill-accent text-accent" : "text-border"}
          style={{ width: size, height: size }}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function ReviewsSection({ cardSlug, cardName }: { cardSlug: string; cardName: string }) {
  const qc = useQueryClient();
  const { data: reviews = [], isLoading } = useQuery(reviewsQueryOptions(cardSlug));

  const { avg, count } = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    return { avg: sum / reviews.length, count: reviews.length };
  }, [reviews]);

  const [name, setName] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: async () => {
      const trimmedName = name.trim().slice(0, 80);
      const trimmedText = text.trim().slice(0, 2000);
      if (trimmedName.length < 2) throw new Error("Укажите имя (минимум 2 символа).");
      if (trimmedText.length < 10) throw new Error("Отзыв слишком короткий (минимум 10 символов).");
      if (rating < 1 || rating > 5) throw new Error("Оценка должна быть от 1 до 5.");
      const { error } = await supabase.from("reviews").insert({
        card_slug: cardSlug,
        author_name: trimmedName,
        rating,
        text: trimmedText,
        status: "pending",
        is_demo: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setSubmitted(true);
      setErrorMsg(null);
      setName("");
      setText("");
      setRating(5);
      qc.invalidateQueries({ queryKey: ["reviews", cardSlug] });
    },
    onError: (err: Error) => setErrorMsg(err.message),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    submit.mutate();
  }

  return (
    <section className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold text-primary">Отзывы</h2>
        {count > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-serif text-2xl font-bold text-primary">{avg.toFixed(1)}</span>
            <Stars value={Math.round(avg)} />
            <span>· {count} {pluralReviews(count)}</span>
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Оценка пользователей — отдельно от редакционного балла EraPay.
      </p>

      <div className="mt-6 space-y-3">
        {isLoading && (
          <div className="rounded-lg border border-border bg-background p-5 text-sm text-muted-foreground">
            Загружаем отзывы…
          </div>
        )}
        {!isLoading && reviews.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-surface/40 p-6 text-center text-sm text-muted-foreground">
            Пока нет отзывов — оставьте первый.
          </div>
        )}
        {reviews.map((r) => (
          <article key={r.id} className="rounded-lg border border-border bg-background p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="font-semibold text-primary">{r.author_name}</div>
                {r.is_demo && (
                  <span className="rounded-sm bg-surface px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    образец
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Stars value={r.rating} />
                <span>{formatReviewDate(r.created_at)}</span>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{r.text}</p>
          </article>
        ))}
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-10 rounded-lg border border-border bg-surface/40 p-6"
        aria-labelledby="review-form-title"
      >
        <h3 id="review-form-title" className="font-serif text-lg font-bold text-primary">
          Оставить отзыв о {cardName}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Отзыв уйдёт на модерацию и появится после проверки.
        </p>

        {submitted && (
          <div
            role="status"
            className="mt-4 rounded-md border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-primary"
          >
            Спасибо, отзыв отправлен на проверку.
          </div>
        )}
        {errorMsg && (
          <div
            role="alert"
            className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {errorMsg}
          </div>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="review-name" className="text-xs font-semibold text-primary">
              Имя
            </label>
            <input
              id="review-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
              autoComplete="name"
              className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="review-rating" className="text-xs font-semibold text-primary">
              Оценка
            </label>
            <select
              id="review-rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value={5}>★★★★★ — отлично</option>
              <option value={4}>★★★★☆ — хорошо</option>
              <option value={3}>★★★☆☆ — нормально</option>
              <option value={2}>★★☆☆☆ — плохо</option>
              <option value={1}>★☆☆☆☆ — ужасно</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="review-text" className="text-xs font-semibold text-primary">
            Отзыв
          </label>
          <textarea
            id="review-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2000}
            required
            rows={5}
            placeholder="Что понравилось, что нет — конкретные сервисы, скорость выпуска, комиссии."
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <div className="mt-1 text-right text-[11px] text-muted-foreground">{text.length}/2000</div>
        </div>

        <div className="mt-5">
          <button
            type="submit"
            disabled={submit.isPending}
            className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {submit.isPending ? "Отправляем…" : "Отправить отзыв"}
          </button>
        </div>
      </form>
    </section>
  );
}

function pluralReviews(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "отзыв";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "отзыва";
  return "отзывов";
}