import type { ReactNode } from "react";
import type { PageId, Role } from "../navigation";
import Sidebar from "./Sidebar";

type AppLayoutProps = {
  role: Role;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  children: ReactNode;
};

export default function AppLayout({
  role,
  activePage,
  onNavigate,
  children,
}: AppLayoutProps) {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0d1015] text-white md:grid md:grid-cols-[240px_minmax(0,1fr)]"
    >
      <Sidebar role={role} activePage={activePage} onNavigate={onNavigate} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}