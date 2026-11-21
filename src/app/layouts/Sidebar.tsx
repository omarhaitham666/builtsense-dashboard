import { useState } from "react";
import { LogOut } from "lucide-react";

import { logout } from "../../features/auth/api";
import { navigationItems, type PageId, type Role } from "../navigation";

type SidebarProps = {
  role: Role;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
};

export default function Sidebar({
  role,
  activePage,
  onNavigate,
}: SidebarProps) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const visibleItems = navigationItems.filter((item) =>
    item.roles.includes(role)
  );

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
    } catch {
      setLogoutError("تعذّر تسجيل الخروج. جرّب مرة تانية.");
      setLoggingOut(false);
    }
  }

  return (
    <aside className="flex flex-col border-b border-[#303846] bg-[#101318] md:min-h-screen md:border-b-0 md:border-e">
      <div className="mx-4 flex justify-center border-b border-[#303846] py-6 md:py-9">
        <img
          src="../public/16215a14-ebb3-4220-94df-0669b437d0ca_500x205.png"
          alt="Built Sense"
          className="h-12 w-auto md:h-16"
        />
      </div>

      <nav
        aria-label="القائمة الرئيسية"
        className="flex gap-2 overflow-x-auto p-3 md:flex-col md:p-4"
      >
        {visibleItems.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id;

          return (
            <button
              key={id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavigate(id)}
              className={[
                "flex shrink-0 items-center gap-3 rounded-lg px-4 py-3",
                "text-start font-medium motion-safe:transition-colors",
                "focus-visible:outline-2 focus-visible:outline-[#f5bd20]",
                isActive
                  ? "bg-[#1552ac] text-white"
                  : "text-slate-300 hover:bg-[#1b222c] hover:text-white",
              ].join(" ")}
            >
              <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mx-4 border-t border-[#303846] py-3 md:mt-auto">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-start text-slate-300 hover:bg-[#1b222c] hover:text-white focus-visible:outline-2 focus-visible:outline-[#f5bd20] disabled:cursor-wait disabled:opacity-60 motion-safe:transition-colors"
        >
          <LogOut size={20} strokeWidth={1.8} aria-hidden="true" />
          <span>{loggingOut ? "جارٍ تسجيل الخروج…" : "تسجيل الخروج"}</span>
        </button>

        {logoutError && (
          <p role="alert" className="mt-2 px-4 text-sm text-amber-300">
            {logoutError}
          </p>
        )}
      </div>
    </aside>
  );
}