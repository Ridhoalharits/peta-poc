import { History, UserCog, UserSearch, Users, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Menu",
    items: [
      { label: "Talent Recommendation", href: "/talent-recommendation", icon: UserSearch },
      { label: "Talent Management", href: "/talent-management", icon: Users },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Audit Log", href: "/audit-log", icon: History },
      { label: "User Management", href: "/user-management", icon: UserCog },
    ],
  },
];

/** Active when the pathname is the href or a nested route under it. */
export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
