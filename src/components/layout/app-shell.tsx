import { AppSidebar } from "./app-sidebar";

/** Sidebar + right column. Each page renders its own <PageHeader> followed by <PageMain>. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-1">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

export function PageMain({ children }: { children: React.ReactNode }) {
  return <main className="flex flex-col gap-6 px-10 pt-8 pb-10">{children}</main>;
}
