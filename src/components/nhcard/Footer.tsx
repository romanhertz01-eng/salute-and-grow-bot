import { Link } from "@tanstack/react-router";

const cols = [
  { title: "Рейтинг", links: ["Все карты", "Лучшие 2026", "Обновления"] },
  { title: "По задаче", links: ["Для подписок", "Для покупок", "Для путешествий"] },
  { title: "По странам", links: ["Армения", "Казахстан", "Турция", "Киргизия"] },
  { title: "О проекте", links: ["Как мы оцениваем", "Редакция", "Раскрытие"] },
  { title: "Контакты", links: ["Написать редакции", "Партнёрам"] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(5,1fr)]">
          <div>
            <Link to="/" className="font-serif text-2xl font-bold" aria-label="EraPay — на главную">
              <span className="text-primary">Era</span>
              <span className="text-accent">Pay</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Независимый мониторинг зарубежных виртуальных карт. Проверяем, сравниваем, помогаем выбрать.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                {col.title}
              </div>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-foreground/75 hover:text-primary">
                      {l}
                    </a>
                  </li>
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