"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTitle } from "@/components/shared/page-title";
import { SectionCard } from "@/components/shared/section-card";
import type { PetaUser } from "@/lib/data/user-management";
import { CountPill } from "./count-pill";
import { UsersTable } from "./users-table";

export type UserTab = "users" | "requests";

interface UserManagementProps {
  initialUsers: PetaUser[];
  initialTab?: UserTab;
}

/** UM-01 / UM-04. Owns the users for the session, so both tabs and both pills stay in sync. */
export function UserManagement({ initialUsers, initialTab = "users" }: UserManagementProps) {
  const [users] = useState(initialUsers); // UM03 and UM04 change statuses and remove rejected requests.
  const [tab, setTab] = useState<UserTab>(initialTab);
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim();
  const matches = (user: PetaUser) => user.username.toLowerCase().includes(trimmedQuery.toLowerCase());
  const pendingCount = users.filter((user) => user.status === "Pending Request").length;

  return (
    <>
      <PageTitle title="User Management" />
      <Tabs value={tab} onValueChange={(value) => setTab(value as UserTab)} className="gap-6">
        <div className="flex items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="users">
              Users
              <CountPill count={users.length} tone="neutral" />
            </TabsTrigger>
            <TabsTrigger value="requests">
              Activation Requests
              {pendingCount > 0 && <CountPill count={pendingCount} tone="primary" />}
            </TabsTrigger>
          </TabsList>
          <div className="relative w-[300px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by username…"
              aria-label="Search by username"
              className="pl-9 [&::-webkit-search-cancel-button]:appearance-none"
            />
          </div>
        </div>
        <TabsContent value="users">
          <UsersTable users={users.filter(matches)} query={trimmedQuery} />
        </TabsContent>
        <TabsContent value="requests">
          <SectionCard>{null}</SectionCard>
        </TabsContent>
      </Tabs>
    </>
  );
}
