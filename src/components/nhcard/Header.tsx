import { Link } from "@tanstack/react-router";
import { formatToday } from "@/lib/cards";
import { ChevronDown, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

type LeafItem =
  | { label: string; kind: "hash"; hash: string }
  | { label: string; kind: "route"; to: string };
type NavItem = LeafItem | { label: string; kind: "group"; items: LeafItem[] };

const nav: NavItem[] = [
  { label: "Рейтинг", kind: "hash", hash: "rating" },
  {
    label: "Карты",
    kind: "group",
    items: [
      { label: "Все карты", kind: "hash", hash: "rating" },
      { label: "По задаче", kind: "hash", hash: "task" },
      { label: "По странам", kind: "hash", hash: "countries" },
      { label: "Зарубежные виртуальные карты", kind: "route", to: "/foreign-virtual-cards" },
      { label: "Карты для подписок", kind: "route", to: "/cards-for-subscriptions" },
      { label: "Карты для путешествий", kind: "route", to: "/travel-cards" },
    ],
  },
  { label: "Подбор", kind: "route", to: "/podbor" },
  { label: "Калькулятор", kind: "hash", hash: "calculator" },
  {
    label: "Ещё",
    kind: "group",
    items: [
      { label: "Крипта", kind: "route", to: "/crypto" },
      { label: "Нейросети", kind: "route", to: "/ai" },
      { label: "Банковские карты", kind: "route", to: "/banks" },
      { label: "Блог", kind: "route", to: "/blog" },
      { label: "Методология", kind: "route", to: "/methodology" },
      { label: "FAQ", kind: "hash", hash: "faq" },
    ],
  },
];

function LeafLink({
  item,
  className,
  onNavigate,
}: {
  item: LeafItem;
  className?: string;
  onNavigate?: () => void;
}) {
  if (item.kind === "route") {
    return (
      <Link to={item.to} className={className} onClick={onNavigate}>
        {item.label}
      </Link>
    );
  }
  return (
    <Link to="/" hash={item.hash} className={className} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

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

        <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          {nav.map((item) => {
            if (item.kind === "group") {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger className="inline-flex items-center gap-1 text-sm font-medium text-foreground/75 outline-none transition-colors hover:text-primary focus-visible:text-primary data-[state=open]:text-primary">
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-56">
                    {item.items.map((leaf) => (
                      <DropdownMenuItem key={leaf.label} asChild>
                        <LeafLink item={leaf} className="w-full cursor-pointer text-sm" />
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            return (
              <LeafLink
                key={item.label}
                item={item}
                className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
              />
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <span className="hidden text-xs text-muted-foreground md:inline">
            Обновлено: {formatToday()}
          </span>
          <Link
            to="/"
            hash="rating"
            className="hidden h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:inline-flex"
          >
            К рейтингу
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/80 hover:bg-muted lg:hidden"
              aria-label="Открыть меню"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto">
              <SheetTitle className="font-serif text-lg">Меню</SheetTitle>
              <div className="mt-6 flex flex-col gap-1">
                {nav.map((item) => {
                  if (item.kind === "group") {
                    return (
                      <Accordion key={item.label} type="single" collapsible>
                        <AccordionItem value={item.label} className="border-b border-border">
                          <AccordionTrigger className="py-3 text-sm font-medium">
                            {item.label}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col">
                              {item.items.map((leaf) => (
                                <LeafLink
                                  key={leaf.label}
                                  item={leaf}
                                  onNavigate={closeMobile}
                                  className="rounded-md px-2 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-primary"
                                />
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    );
                  }
                  return (
                    <LeafLink
                      key={item.label}
                      item={item}
                      onNavigate={closeMobile}
                      className="border-b border-border py-3 text-sm font-medium text-foreground/80 hover:text-primary"
                    />
                  );
                })}
                <Link
                  to="/"
                  hash="rating"
                  onClick={closeMobile}
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                >
                  К рейтингу
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}