import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isAdminUser } from "@/lib/admin-auth";
import { claimFirstAdmin, hasAnyAdmin } from "@/lib/claim-admin.functions";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Вход в админку — EraPay" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function refreshBootstrapState(userId: string | null) {
    setSessionUserId(userId);
    try {
      const res = await hasAnyAdmin();
      setAdminExists(res.exists);
    } catch {
      setAdminExists(true);
    }
  }

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        await refreshBootstrapState(null);
        return;
      }
      if (await isAdminUser(data.user.id)) {
        navigate({ to: "/admin", replace: true });
        return;
      }
      await refreshBootstrapState(data.user.id);
    })();
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    if (mode === "signup") {
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin/login` },
      });
      if (signUpErr) {
        setError(signUpErr.message);
        setLoading(false);
        return;
      }
      if (!data.session) {
        setNotice("Аккаунт создан. Подтвердите email и войдите.");
        setMode("login");
        setLoading(false);
        return;
      }
      await refreshBootstrapState(data.user?.id ?? null);
      setLoading(false);
      return;
    }

    const { data, error: signInErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInErr || !data.user) {
      setError(signInErr?.message ?? "Не удалось войти");
      setLoading(false);
      return;
    }
    if (await isAdminUser(data.user.id)) {
      navigate({ to: "/admin", replace: true });
      return;
    }
    await refreshBootstrapState(data.user.id);
    setLoading(false);
  }

  async function handleClaim() {
    setClaiming(true);
    setError(null);
    try {
      await claimFirstAdmin();
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось назначить админа");
      setAdminExists(true);
      setClaiming(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">
          {mode === "login" ? "Вход в админку" : "Регистрация"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {mode === "login"
            ? "Только для администраторов EraPay."
            : "Создайте аккаунт для доступа к админке."}
        </p>

        <form onSubmit={handleSubmit}>
          <label className="mt-5 block text-xs font-medium text-slate-600">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />

          <label className="mt-3 block text-xs font-medium text-slate-600">Пароль</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />

          {error && (
            <div className="mt-3 rounded-md bg-red-50 p-2 text-xs text-red-700">{error}</div>
          )}
          {notice && (
            <div className="mt-3 rounded-md bg-emerald-50 p-2 text-xs text-emerald-700">{notice}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "login" ? "signup" : "login"));
            setError(null);
            setNotice(null);
          }}
          className="mt-3 w-full text-center text-xs text-slate-500 hover:text-slate-800"
        >
          {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
        </button>

        {sessionUserId && adminExists === false && (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs text-amber-900">
              Доступно только для первого пользователя — назначает вас админом проекта.
            </p>
            <button
              type="button"
              onClick={handleClaim}
              disabled={claiming}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-amber-600 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {claiming && <Loader2 className="h-4 w-4 animate-spin" />}
              Стать первым администратором
            </button>
          </div>
        )}

        {sessionUserId && adminExists === true && (
          <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            Вы вошли, но у аккаунта нет роли admin. Обратитесь к владельцу проекта.
          </div>
        )}
      </div>
    </div>
  );
}