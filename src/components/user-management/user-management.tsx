"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PageTitle } from "@/components/shared/page-title";
import type { PetaUser } from "@/lib/data/user-management";
import { toastSuccess } from "@/lib/toast";
import { CountPill } from "./count-pill";
import { RequestsTable } from "./requests-table";
import { ACTION_TOAST, CONFIRM_COPY, DEMO_USER, applyUserAction, type ConfirmKind, type UserAction } from "./user-actions";
import { UsersTable } from "./users-table";

export type UserTab = "users" | "requests";
export type UserDemoOpen = keyof typeof DEMO_USER;

interface Confirm {
  kind: ConfirmKind;
  username: string;
}

interface UserManagementProps {
  initialUsers: PetaUser[];
  initialTab?: UserTab;
  /** Demo: ?open=menu | deactivate | reactivate | reject. */
  demoOpen?: UserDemoOpen;
}

function initialConfirm(demoOpen?: UserDemoOpen): Confirm | null {
  if (!demoOpen || demoOpen === "menu") return null;
  return { kind: demoOpen, username: DEMO_USER[demoOpen] };
}

/** UM-01 / UM-04. Owns the users for the session, so both tabs and both pills stay in sync. */
export function UserManagement({ initialUsers, initialTab = "users", demoOpen }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers);
  const [tab, setTab] = useState<UserTab>(initialTab);
  const [query, setQuery] = useState("");
  // The last confirm stays set while the dialog fades out, so its text doesn't blank mid-animation.
  const [confirm, setConfirm] = useState<Confirm | null>(() => initialConfirm(demoOpen));
  const [confirmOpen, setConfirmOpen] = useState(confirm !== null);
  const askConfirm = (next: Confirm) => {
    setConfirm(next);
    setConfirmOpen(true);
  };

  const trimmedQuery = query.trim();
  const matches = (user: PetaUser) => user.username.toLowerCase().includes(trimmedQuery.toLowerCase());
  const pending = users.filter((user) => user.status === "Pending Request");
  const pendingCount = pending.length;

  const runAction = (action: UserAction, username: string) => {
    setUsers((current) => applyUserAction(current, action, username));
    toastSuccess(ACTION_TOAST[action].title, ACTION_TOAST[action].description(username));
  };
  const copy = confirm ? CONFIRM_COPY[confirm.kind] : null;

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
          <UsersTable
            users={users.filter(matches)}
            query={trimmedQuery}
            menuOpenFor={demoOpen === "menu" ? DEMO_USER.menu : undefined}
            onChoose={(user, choice) =>
              choice === "requests" ? setTab("requests") : askConfirm({ kind: choice, username: user.username })
            }
          />
        </TabsContent>
        <TabsContent value="requests">
          <RequestsTable
            requests={pending.filter(matches)}
            hasPending={pending.length > 0}
            query={trimmedQuery}
            onApprove={(username) => runAction("approve", username)}
            onReject={(username) => askConfirm({ kind: "reject", username })}
          />
        </TabsContent>
      </Tabs>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={copy?.title ?? ""}
        message={confirm && copy ? copy.message(confirm.username) : ""}
        confirmLabel={copy?.confirmLabel ?? ""}
        tone={copy?.tone}
        onConfirm={() => confirm && runAction(confirm.kind, confirm.username)}
        onCloseAutoFocus={(event) => {
          // Back to the button that started it: the row's menu button, or the Reject button on the Requests tab.
          const label = confirm?.kind === "reject" ? `Reject ${confirm.username}` : `More actions for ${confirm?.username}`;
          const opener = document.querySelector<HTMLElement>(`button[aria-label="${label}"]`);
          if (opener) {
            event.preventDefault();
            opener.focus();
          }
        }}
      />
    </>
  );
}
