import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";

type Crumb = { label: string; to?: string };

export function InfoShell({
  eyebrow,
  title,
  lead,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  children: ReactNode;
}) {
  const allCrumbs: Crumb[] = [{ label: "Главная", to: "/" }, ...crumbs, { label: title }];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
            <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {allCrumbs.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1.5">
                  {c.to ? (
                    <Link to={c.to} className="hover:text-primary">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-primary">{c.label}</span>
                  )}
                  {i < allCrumbs.length - 1 && <ChevronRight className="h-3 w-3 opacity-60" />}
                </span>
              ))}
            </nav>
            {eyebrow && (
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                {eyebrow}
              </div>
            )}
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
              {title}
            </h1>
            {lead && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{lead}</p>}
          </div>
        </section>
        <section>
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
            <div className="prose-editorial space-y-6 text-[15px] leading-relaxed text-foreground/85">
              {children}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-10 font-serif text-2xl font-bold tracking-tight text-primary sm:text-3xl">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-6 font-serif text-lg font-bold text-primary">{children}</h3>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-foreground/85">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-foreground/85">{children}</ul>;
}

export function Callout({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "warn" }) {
  return (
    <div
      className={
        tone === "warn"
          ? "rounded-lg border border-accent/40 bg-accent/5 px-5 py-4 text-sm text-foreground/85"
          : "rounded-lg border border-border bg-surface px-5 py-4 text-sm text-foreground/85"
      }
    >
      {children}
    </div>
  );
}