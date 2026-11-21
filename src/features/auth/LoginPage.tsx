import { useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { login, type Profile } from "./api";
import "./LoginPage.css";

type LoginPageProps = {
  onLogin: (profile: Profile) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logoFailed, setLogoFailed] = useState(false);

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
      <section className="bs-login__stage" aria-labelledby="login-title">
        <div className="bs-login__brand">
          {logoFailed ? (
            <span className="bs-login__wordmark" dir="ltr">
              BUILT <strong>SENSE</strong>
            </span>
          ) : (
            <img
              className="bs-login__logo"
              src={`${import.meta.env.BASE_URL}built-sense-logo.png`}
              alt="Built Sense"
              width="500"
              height="205"
              onError={() => setLogoFailed(true)}
            />
          )}
        </div>

        <div className="bs-login__card">
          <header className="bs-login__header">
            <span className="bs-login__accent" aria-hidden="true" />
            <h1 id="login-title">تسجيل الدخول</h1>
          </header>

          <form
            className="bs-login__form"
            onSubmit={handleSubmit}
            aria-busy={loading}
          >
            <div className="bs-login__field">
              <label htmlFor="login-email">البريد الإلكتروني</label>

              <div className="bs-login__input-wrap">
                <Mail size={18} aria-hidden="true" />

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  dir="ltr"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="bs-login__field">
              <label htmlFor="login-password">كلمة المرور</label>

              <div className="bs-login__input-wrap">
                <LockKeyhole size={18} aria-hidden="true" />

                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <button
                  className="bs-login__eye"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  aria-controls="login-password"
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="bs-login__error" role="alert">
                {error}
              </p>
            )}

            <button
              className="bs-login__submit"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? "جارٍ تسجيل الدخول…" : "دخول"}</span>

              {loading ? (
                <LoaderCircle
                  className="bs-login__spinner"
                  size={19}
                  aria-hidden="true"
                />
              ) : (
                <ArrowLeft size={19} aria-hidden="true" />
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}