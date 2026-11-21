import { useState, type FormEvent } from "react";
import { login, type Profile } from "./api";

type LoginPageProps = {
  onLogin: (profile: Profile) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const profile = await login(email, password);
      onLogin(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="grid min-h-screen place-items-center bg-[#0d1015] p-5 text-white"
    >
      <form
        onSubmit={handleSubmit}
        className="grid w-full max-w-sm gap-5 rounded-xl border border-[#303846] bg-[#15191f] p-6"
      >
        <h1 className="text-2xl font-bold">تسجيل الدخول</h1>

        <label className="grid gap-2">
          البريد الإلكتروني
          <input
            type="email"
            dir="ltr"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-lg border border-slate-600 bg-[#1b2028] p-3"
          />
        </label>

        <label className="grid gap-2">
          كلمة المرور
          <input
            type="password"
            dir="ltr"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-lg border border-slate-600 bg-[#1b2028] p-3"
          />
        </label>

        {error && <p role="alert" className="text-amber-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 p-3 font-semibold disabled:opacity-60"
        >
          {loading ? "جارٍ تسجيل الدخول…" : "دخول"}
        </button>
      </form>
    </main>
  );
}