import { Suspense } from "react";
import { PageMain } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { UserManagement } from "@/components/user-management/user-management";
import { listUsers } from "@/lib/data/user-management";
import { param, type SearchParamsRecord } from "@/lib/demo";

async function UserManagementFromParams({ searchParams }: { searchParams: Promise<SearchParamsRecord> }) {
  const sp = await searchParams;
  return <UserManagement initialUsers={listUsers()} initialTab={param(sp, "tab") === "requests" ? "requests" : "users"} />;
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
