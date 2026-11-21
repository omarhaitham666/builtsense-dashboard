import { useRef, useState, type FormEvent } from "react";
import { login, type Profile } from "./api";
import "./LoginPage.css";
import LoginBrand from "./LoginBrand";

type LoginPageProps = {
  onLogin: (profile: Profile) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    submitting.current = true;
    setLoading(true);
    setError("");

    try {
      const profile = await login(email.trim(), password);
      onLogin(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر تسجيل الدخول");
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  return (
    <main className="bs-login" dir="rtl">
      <div className="bs-login-shell">
        <LoginBrand />

        <form
          className="bs-login-card"
          onSubmit={handleSubmit}
          aria-labelledby="bs-login-title"
          aria-busy={loading}
        >
          <h1 id="bs-login-title">تسجيل الدخول</h1>

          <div className="bs-login-field">
            <label htmlFor="bs-login-email">البريد الإلكتروني</label>
            <input
              id="bs-login-email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="username"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="bs-login-field">
            <label htmlFor="bs-login-password">كلمة المرور</label>

            <div className="bs-login-password">
              <input
                id="bs-login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                dir="ltr"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                className="bs-login-toggle"
                type="button"
                aria-controls="bs-login-password"
                aria-label={
                  showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                }
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? "إخفاء" : "إظهار"}
              </button>
            </div>
          </div>

          {error && (
            <p className="bs-login-error" role="alert">
              {error}
            </p>
          )}

          <button className="bs-login-submit" type="submit" disabled={loading}>
            {loading && <span className="bs-login-spinner" aria-hidden="true" />}
            {loading ? "جارٍ تسجيل الدخول…" : "دخول"}
          </button>
        </form>
      </div>
    </main>
  );
}