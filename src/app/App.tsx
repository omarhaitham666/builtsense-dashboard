import { useState } from "react";
import EmployeesPage from "../features/team/ui/EmployeesPage";
import AppLayout from "./layouts/AppLayout";
import { navigationItems, type PageId, type Role } from "./navigation";

function Workspace({ role }: { role: Role }) {
  const [activePage, setActivePage] = useState<PageId>(
    role === "admin" ? "users" : "my-report"
  );

  const pageTitle = navigationItems.find(
    (item) => item.id === activePage
  )?.label;

  return (
    <AppLayout role={role} activePage={activePage} onNavigate={setActivePage}>
      {activePage === "team" ? (
        <EmployeesPage />
      ) : (
        <main className="px-6 py-10 md:px-10">
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
        </main>
      )}
    </AppLayout>
  );
}

export default function App() {
  return <Workspace role="admin" />;
}