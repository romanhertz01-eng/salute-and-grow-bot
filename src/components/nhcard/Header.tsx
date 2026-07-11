import { Link } from "@tanstack/react-router";
import { formatToday } from "@/lib/cards";

type NavItem =
  | { label: string; kind: "hash"; hash: string }
  | { label: string; kind: "route"; to: string };

const nav: NavItem[] = [
  { label: "Рейтинг", kind: "hash", hash: "rating" },
  { label: "Калькулятор", kind: "hash", hash: "calculator" },
  { label: "Подбор", kind: "route", to: "/podbor" },
  { label: "Методология", kind: "hash", hash: "methodology" },
  { label: "FAQ", kind: "hash", hash: "faq" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label="EraPay — на главную"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-serif text-lg font-bold text-primary-foreground"
          >
            E
          </span>
          <span className="font-serif text-2xl font-bold tracking-tight">
            <span className="text-primary">Era</span>
            <span className="text-accent">Pay</span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {nav.map((item) =>
            item.kind === "route" ? (
              <Link
                key={item.label}
                to={item.to}
                className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.label}
                to="/"
                hash={item.hash}
                className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <span className="hidden text-xs text-muted-foreground md:inline">
            Обновлено: {formatToday()}
          </span>
          <Link
            to="/"
            hash="rating"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            К рейтингу
          </Link>
        </div>
      </div>
    </header>
  );
}