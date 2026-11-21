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
  const visibleItems = navigationItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <aside className="border-b border-[#303846] bg-[#101318] md:min-h-screen md:border-e md:border-b-0">
      <div className="mx-4 flex justify-center border-b border-[#303846] py-6 md:py-9">
        <img
          src=".././public/16215a14-ebb3-4220-94df-0669b437d0ca_500x205.png"
          alt="Built Sense"
          className="h-12 w-auto md:h-16"
        />
      </div>

      <nav
        aria-label="القائمة الرئيسية"
        className="flex gap-2 overflow-x-auto p-3 md:flex-col md:p-4"
      >
        {visibleItems.map(({ id, label, icon: Icon }) => {
          const isActive = id === activePage;

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
    </aside>
  );
}