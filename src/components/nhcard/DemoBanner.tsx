import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "erapay:demo-banner-dismissed";

export function DemoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="note"
      className="sticky top-0 z-50 w-full border-b border-amber-200/70 bg-amber-50 text-amber-900"
    >
      <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-1.5 text-xs sm:px-6 lg:px-8">
        <span className="rounded bg-amber-200/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
          Демо
        </span>
        <p className="flex-1 leading-snug">
          Демо-версия. Данные приведены для примера и не являются офертой.
        </p>
        <button
          type="button"
          aria-label="Закрыть уведомление"
          onClick={() => {
            try {
              localStorage.setItem(STORAGE_KEY, "1");
            } catch {
              /* noop */
            }
            setVisible(false);
          }}
          className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-amber-100"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}