import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type FooterLink =
  | { label: string; kind: "hash"; hash: string }
  | { label: string; kind: "route"; to: string }
  | { label: string; kind: "external"; href: string; rel?: string };

type FooterColumn = { title: string; links: FooterLink[] };

const columns: FooterColumn[] = [
  {
    title: "Рейтинг",
    links: [
      { label: "Все карты", kind: "hash", hash: "rating" },
      { label: "Калькулятор", kind: "hash", hash: "calculator" },
      { label: "Подобрать карту", kind: "route", to: "/podbor" },
    ],
  },
  {
    title: "О проекте",
    links: [
      { label: "Методология", kind: "hash", hash: "methodology" },
      { label: "FAQ", kind: "hash", hash: "faq" },
      { label: "Блог", kind: "route", to: "/blog" },
      { label: "Банковские карты", kind: "route", to: "/banks" },
    ],
  },
  {
    title: "Контакты",
    links: [
      { label: "Telegram", kind: "external", href: "#", rel: "nofollow" },
      { label: "Написать редакции", kind: "external", href: "#" },
    ],
  },
];

function renderLink(link: FooterLink): ReactNode {
  const cls = "text-sm text-foreground/75 hover:text-primary";
  if (link.kind === "hash") {
    return (
      <Link to="/" hash={link.hash} className={cls}>
        {link.label}
      </Link>
    );
  }
  if (link.kind === "route") {
    return (
      <Link to={link.to} className={cls}>
        {link.label}
      </Link>
    );
  }
  return (
    <a href={link.href} rel={link.rel} className={cls}>
      {link.label}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Link to="/" className="font-serif text-2xl font-bold" aria-label="EraPay — на главную">
              <span className="text-primary">Era</span>
              <span className="text-accent">Pay</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Независимый мониторинг зарубежных виртуальных карт. Проверяем, сравниваем, помогаем выбрать.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                {col.title}
              </div>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>{renderLink(l)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          EraPay — независимый информационный проект. Мы не являемся эмитентом карт и не оказываем услуг по их
          выпуску. Рейтинг носит информационный характер. Всегда проверяйте условия у эмитента. Некоторые ссылки —
          партнёрские.
        </div>
      </div>
    </footer>
  );
}