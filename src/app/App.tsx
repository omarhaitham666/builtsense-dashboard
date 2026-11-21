import { useState } from "react";
import LoginPage from "../features/auth/LoginPage";
import type { Profile } from "../features/auth/api";
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

  if (!profile) {
    return <LoginPage onLogin={setProfile} />;
  }

  return <Workspace role={profile.role} />;
}