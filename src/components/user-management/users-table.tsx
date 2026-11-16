"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectionCard } from "@/components/shared/section-card";
import type { PetaUser } from "@/lib/data/user-management";
import { cn } from "@/lib/utils";
import { UserRowMenu, type RowMenuChoice } from "./user-row-menu";
import { UserStatusBadge } from "./user-status-badge";

export const HEAD_CLASSES = "h-11 px-4 text-[13px] font-medium text-muted-foreground";
export const ROW_CLASSES = "h-13 border-zinc-100 hover:bg-table-header";

/** A single muted row for a search with no hits. */
export function NoMatchRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="py-10 text-center text-sm text-muted-foreground">
        {children}
      </TableCell>
    </TableRow>
  );
}

interface UsersTableProps {
  users: PetaUser[];
  query: string;
  /** Demo: the username whose menu starts open (?open=menu). */
  menuOpenFor?: string;
  onChoose: (user: PetaUser, choice: RowMenuChoice) => void;
}

/** UM-01. Users in data order; no sorting or pagination, so it's a plain shadcn Table. */
export function UsersTable({ users, query, menuOpenFor, onChoose }: UsersTableProps) {
  return (
    <SectionCard contentClassName="p-0 gap-0">
      <Table aria-label="Users">
        <TableHeader>
          <TableRow className="bg-table-header hover:bg-table-header">
            <TableHead className={HEAD_CLASSES}>Username</TableHead>
            <TableHead className={HEAD_CLASSES}>Role</TableHead>
            <TableHead className={HEAD_CLASSES}>Status</TableHead>
            <TableHead className={cn(HEAD_CLASSES, "text-right")}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <NoMatchRow colSpan={4}>No users match “{query}”.</NoMatchRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className={ROW_CLASSES}>
                <TableCell
                  className={cn("w-[46%] px-4 text-sm font-medium", user.status === "Deactivated" && "text-muted-foreground")}
                >
                  {user.username}
                </TableCell>
                <TableCell className="w-[23%] px-4 text-[13px] text-zinc-600">{user.role}</TableCell>
                <TableCell className="px-4">
                  <UserStatusBadge status={user.status} />
                </TableCell>
                <TableCell className="px-4 text-right">
                  <UserRowMenu
                    user={user}
                    defaultOpen={user.username === menuOpenFor}
                    onChoose={(choice) => onChoose(user, choice)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </SectionCard>
  );
}
