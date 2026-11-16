import { Suspense } from "react";
import { PageMain } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ToastOnMount } from "@/components/shared/toast-on-mount";
import { ACTION_TOAST, DEMO_TOAST, DEMO_USER, demoStartingUsers } from "@/components/user-management/user-actions";
import { UserManagement, type UserDemoOpen } from "@/components/user-management/user-management";
import { listUsers } from "@/lib/data/user-management";
import { param, type SearchParamsRecord } from "@/lib/demo";

const DEMO_OPENS = Object.keys(DEMO_USER) as UserDemoOpen[];

async function UserManagementFromParams({ searchParams }: { searchParams: Promise<SearchParamsRecord> }) {
  const sp = await searchParams;
  const toast = param(sp, "toast");
  const done = toast ? DEMO_TOAST[toast] : undefined;

  return (
    <>
      <UserManagement
        initialUsers={demoStartingUsers(listUsers(), toast, param(sp, "state"))}
        initialTab={param(sp, "tab") === "requests" ? "requests" : "users"}
        demoOpen={DEMO_OPENS.find((open) => open === param(sp, "open"))}
      />
      {done && (
        <ToastOnMount title={ACTION_TOAST[done.action].title} description={ACTION_TOAST[done.action].description(done.username)} />
      )}
    </>
  );
}

export default function UserManagementPage({ searchParams }: PageProps<"/user-management">) {
  return (
    <>
      <PageHeader items={[{ label: "Settings" }, { label: "User Management" }]} />
      <PageMain>
        {/* searchParams are only known per request; the prerendered shell shows the Users tab. */}
        <Suspense fallback={<UserManagement initialUsers={listUsers()} />}>
          <UserManagementFromParams searchParams={searchParams} />
        </Suspense>
      </PageMain>
    </>
  );
}
