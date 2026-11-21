import {
  ClipboardList,
  ScanSearch,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type Role = "admin" | "employee";
export type PageId = "users" | "team" | "my-report" | "blog-checker";

type NavigationItem = {
  id: PageId;
  label: string;
  icon: LucideIcon;
  roles: Role[];
};

export const navigationItems: NavigationItem[] = [
  {
    id: "users",
    label: "إدارة المستخدمين",
    icon: Users,
    roles: ["admin"],
  },
  {
    id: "team",
    label: "فريق العمل",
    icon: UsersRound,
    roles: ["admin"],
  },
  {
    id: "my-report",
    label: "تقريري اليومي",
    icon: ClipboardList,
    roles: ["employee"],
  },
  {
    id: "blog-checker",
    label: "فحص المدونات",
    icon: ScanSearch,
    roles: ["admin", "employee"],
  },
];