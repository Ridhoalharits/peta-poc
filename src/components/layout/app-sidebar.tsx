"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CURRENT_USER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { NAV_GROUPS, isNavItemActive } from "./nav-config";

const LOGO_WIDTH = 19; // 250 × 541 source scaled to 40 px tall
const LOGO_HEIGHT = 40;

function UserCard() {
  return (
    <div className="m-3 flex items-center gap-2.5 rounded-[10px] border bg-white p-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[13px] font-semibold text-primary">
        {CURRENT_USER.initials}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold">{CURRENT_USER.name}</span>
        <span className="truncate text-xs text-muted-foreground">{CURRENT_USER.role}</span>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            aria-label="Log out"
            onClick={() => toast.info("Sign out isn't available in this preview")}
          >
            <LogOut />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Log out</TooltipContent>
      </Tooltip>
    </div>
  );
}

/** Nav list. `pathname` is null while the Suspense fallback renders (no item highlighted). */
function SidebarNav({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Main" className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col">
          <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">{group.label}</p>
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => {
              const active = pathname !== null && isNavItemActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-10 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-zinc-700 outline-none hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring",
                      active && "bg-primary-soft font-semibold text-primary hover:bg-primary-soft hover:text-primary",
                    )}
                  >
                    <Icon className="size-[18px] shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function ActiveSidebarNav() {
  return <SidebarNav pathname={usePathname()} />;
}

export function AppSidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r bg-sidebar">
      <div className="flex h-[72px] shrink-0 items-center gap-3 border-b px-5">
        <Image
          src="/brand/kalbe-symbol-color.png"
          alt="Kalbe"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          className="h-10 w-auto"
          priority
        />
        <span className="font-heading text-xl font-bold tracking-[0.06em]">PETA</span>
      </div>
      {/* Dynamic routes (e.g. /talent-management/[[...slug]]) only know the pathname at runtime. */}
      <Suspense fallback={<SidebarNav pathname={null} />}>
        <ActiveSidebarNav />
      </Suspense>
      <UserCard />
    </aside>
  );
}
