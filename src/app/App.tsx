import { useEffect, useState } from "react";

import LoginPage from "../features/auth/LoginPage";
import {
  logout,
  onSignedOut,
  restoreProfile,
  type Profile,
} from "../features/auth/api";

import EmployeesPage from "../features/team/ui/EmployeesPage";
import UsersPage from "../features/users/ui/UsersPage";
import AppLayout from "./layouts/AppLayout";
import { navigationItems, type PageId, type Role } from "./navigation";

function Workspace({ role }: { role: Role }) {
  const [activePage, setActivePage] = useState<PageId>(
    role === "admin" ? "users" : "my-report"
  );

  const currentPage = navigationItems.find(
    (item) => item.id === activePage && item.roles.includes(role)
  );

  function renderPage() {
    switch (currentPage?.id) {
      case "users":
        return <UsersPage />;

      case "team":
        return <EmployeesPage />;

      default:
        return (
          <main className="px-6 py-10 md:px-10">
            <h1 className="text-3xl font-bold">
              {currentPage?.label ?? "الصفحة غير متاحة"}
            </h1>
          </main>
        );
    }
  }

  return (
    <AppLayout
      role={role}
      activePage={activePage}
      onNavigate={setActivePage}
    >
      {renderPage()}
    </AppLayout>
  );
}

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    setCheckingSession(true);
    setSessionError("");

    const unsubscribe = onSignedOut(() => {
      // لو المستخدم خرج أثناء تحميل الحساب، نتجاهل نتيجة الطلب القديم.
      active = false;
      setProfile(null);
      setSessionError("");
      setCheckingSession(false);
    });

    async function loadSession() {
      try {
        const savedProfile = await restoreProfile();

        if (active) {
          setProfile(savedProfile);
        }
      } catch {
        if (active) {
          setSessionError("تعذّر تحميل حسابك. تحقق من الاتصال وحاول مرة أخرى.");
        }
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    }

    void loadSession();

    return () => {
      active = false;
      unsubscribe();
    };
  }, [attempt]);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      setSessionError("تعذّر تسجيل الخروج. حاول مرة أخرى.");
    }
  }

  if (checkingSession || sessionError) {
    return (
      <main
        dir="rtl"
        className="grid min-h-screen place-items-center bg-[#0d1015] p-6 text-white"
      >
        {checkingSession ? (
          <p role="status" className="text-slate-300">
            جارٍ تحميل حسابك…
          </p>
        ) : (
          <div className="grid w-full max-w-sm gap-4 rounded-xl border border-[#303846] bg-[#15191f] p-6 text-center">
            <p role="alert" className="text-amber-300">
              {sessionError}
            </p>

            <button
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
              className="rounded-lg bg-blue-600 px-4 py-3 font-semibold"
            >
              إعادة المحاولة
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-4 py-2 text-slate-300 hover:bg-[#1b222c]"
            >
              تسجيل الخروج
            </button>
          </div>
        )}
      </main>
    );
  }

  if (!profile) {
    return <LoginPage onLogin={setProfile} />;
  }

  return <Workspace key={profile.id} role={profile.role} />;
}