import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import {
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  SERVICES_BY_SLUG,
  iconUrl,
  type Service,
  type ServiceCategory,
} from "@/lib/services";

export function ServiceIcon({ service, size = 28 }: { service: Service; size?: number }) {
  const [failed, setFailed] = useState(false);
  const showPlate = service.plate || failed;
  const initials =
    service.name
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || service.name.slice(0, 2).toUpperCase();

  if (showPlate) {
    // Slightly larger font for 1-letter initials, tighter for 3.
    const fontPx = Math.max(9, Math.round(size * (initials.length >= 3 ? 0.32 : 0.4)));
    return (
      <div
        style={{ width: size, height: size, fontSize: fontPx }}
        className="flex select-none items-center justify-center rounded-md bg-gradient-to-br from-surface to-border/50 font-bold uppercase tracking-tight text-primary ring-1 ring-inset ring-border/60"
        aria-hidden
      >
        {initials.slice(0, 3)}
      </div>
    );
  }

  const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    // Some 404/empty responses still fire onLoad — verify pixels rendered.
    if (e.currentTarget.naturalWidth === 0) setFailed(true);
  };

  return (
    <img
      src={iconUrl(service)}
      alt=""
      aria-hidden
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      onLoad={handleLoad}
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
}

// Back-compat alias for existing imports.
export const ServiceLogo = ServiceIcon;

export function ServicePreview({
  slugs,
  total,
  onOpen,
}: {
  slugs: string[];
  total: number;
  onOpen: () => void;
}) {
  const shown = slugs.slice(0, 4);
  const remaining = Math.max(0, total - shown.length);
  if (shown.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group inline-flex items-center gap-1.5 rounded-md border border-transparent px-1 py-0.5 text-left transition-colors hover:border-border hover:bg-surface"
      aria-label={`Показать все ${total} поддерживаемых сервисов`}
    >
      <div className="flex items-center gap-1">
        {shown.map((slug) => {
          const s = SERVICES_BY_SLUG[slug];
          if (!s) return null;
          return (
            <div
              key={slug}
              title={s.name}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background p-0.5"
            >
              <ServiceIcon service={s} size={20} />
            </div>
          );
        })}
      </div>
      {remaining > 0 && (
        <span className="text-xs font-semibold text-primary group-hover:underline">
          +{remaining}
        </span>
      )}
    </button>
  );
}

export function ServicesModal({
  open,
  onClose,
  cardName,
  slugs,
}: {
  open: boolean;
  onClose: () => void;
  cardName: string;
  slugs: string[];
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  const grouped = useMemo(() => {
    const map = new Map<ServiceCategory, Service[]>();
    for (const slug of slugs) {
      const s = SERVICES_BY_SLUG[slug];
      if (!s) continue;
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return CATEGORY_ORDER
      .map((cat) => ({ cat, items: map.get(cat) ?? [] }))
      .filter((g) => g.items.length > 0);
  }, [slugs]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="services-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">
              {cardName}
            </div>
            <h3
              id="services-modal-title"
              className="mt-0.5 font-serif text-xl font-bold text-primary"
            >
              Сервисы
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">{slugs.length} шт.</span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="overflow-y-auto px-6 py-6">
          <div className="space-y-8">
            {grouped.map(({ cat, items }) => (
              <section key={cat}>
                <div className="mb-3 flex items-baseline justify-between">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {CATEGORY_LABEL[cat]}
                  </h4>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {items.map((s) => (
                    <div
                      key={s.slug}
                      className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5 transition-colors hover:border-primary/30"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background p-1">
                        <ServiceIcon service={s} size={24} />
                      </div>
                      <span className="truncate text-sm font-medium text-primary">{s.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
