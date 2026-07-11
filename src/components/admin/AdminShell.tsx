import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, MessageSquare, CreditCard, FileText, LogOut, Loader2 } from "lucide-react";

type AuthState = "loading" | "unauthorized" | "authorized";

const NAV = [
  { to: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { to: "/admin/reviews", label: "Отзывы", icon: MessageSquare },
  { to: "/admin/cards", label: "Карты", icon: CreditCard },
  { to: "/admin/seo", label: "SEO-страницы", icon: FileText },
] as const;

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const [state, setState] = useState<AuthState>("loading");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (!mounted) return;
      if (userErr || !userData.user) {
        navigate({ to: "/admin/login", replace: true });
        return;
      }
      const { data: isAdmin, error: rpcErr } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      if (!mounted) return;
      if (rpcErr || !isAdmin) {
        setState("unauthorized");
        return;
      }
      setState("authorized");
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (state === "unauthorized") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-lg border bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold">Нет доступа</h1>
          <p className="mt-2 text-sm text-slate-600">
            У вашего аккаунта нет роли admin. Обратитесь к владельцу проекта.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/admin/login", replace: true });
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" /> Выйти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="w-60 shrink-0 border-r bg-white">
        <div className="border-b px-5 py-4">
          <Link to="/" className="text-base font-bold">EraPay Admin</Link>
        </div>
        <nav className="flex flex-col p-2 text-sm">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 rounded-md px-3 py-2 ${
                  active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/admin/login", replace: true });
            }}
            className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-left text-slate-500 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" /> Выйти
          </button>
        </nav>
      </aside>
      <main className="flex-1">
        <header className="border-b bg-white px-6 py-4">
          <h1 className="text-lg font-semibold">{title}</h1>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}