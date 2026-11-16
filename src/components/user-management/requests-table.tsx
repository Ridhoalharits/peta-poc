"use client";

import { Check, UserCheck, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { IconButton } from "@/components/shared/icon-button";
import { SectionCard } from "@/components/shared/section-card";
import type { PetaUser } from "@/lib/data/user-management";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { HEAD_CLASSES, NoMatchRow, ROW_CLASSES } from "./users-table";

interface RequestsTableProps {
  /** Pending users that match the search. */
  requests: PetaUser[];
  /** False when no one is pending at all: then the empty state shows instead of the table. */
  hasPending: boolean;
  query: string;
  onApprove: (username: string) => void;
  onReject: (username: string) => void;
}

/** UM-04. Pending users from the page's state; approve needs no confirm, reject does. */
export function RequestsTable({ requests, hasPending, query, onApprove, onReject }: RequestsTableProps) {
  if (!hasPending) {
    return (
      <SectionCard contentClassName="p-0 gap-0">
        <EmptyState
          variant="inline"
          tone="brand"
          icon={UserCheck}
          title="No pending requests"
          description="When someone asks for access to PETA, their request appears here."
          className="py-16"
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard contentClassName="p-0 gap-0">
      <Table aria-label="Activation requests">
        <TableHeader>
          <TableRow className="bg-table-header hover:bg-table-header">
            <TableHead className={HEAD_CLASSES}>Username</TableHead>
            <TableHead className={HEAD_CLASSES}>Requested Role</TableHead>
            <TableHead className={HEAD_CLASSES}>Requested On</TableHead>
            <TableHead className={cn(HEAD_CLASSES, "text-right")}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <NoMatchRow colSpan={4}>No requests match “{query}”.</NoMatchRow>
          ) : (
            requests.map((user) => (
              <TableRow key={user.id} className={ROW_CLASSES}>
                <TableCell className="w-[45%] px-4 text-sm font-medium">{user.username}</TableCell>
                <TableCell className="w-[22%] px-4 text-[13px] text-zinc-600">{user.role}</TableCell>
                <TableCell className="px-4 text-[13px] text-zinc-600">
                  {user.requestedOn ? formatDate(user.requestedOn) : "—"}
                </TableCell>
                <TableCell className="px-4">
                  <div className="flex justify-end gap-2">
                    <IconButton
                      label={`Reject ${user.username}`}
                      tooltip="Reject"
                      icon={X}
                      variant="outline"
                      size="icon-sm"
                      className="border-destructive-border text-destructive hover:bg-destructive-soft hover:text-destructive"
                      onClick={() => onReject(user.username)}
                    />
                    <IconButton
                      label={`Approve ${user.username}`}
                      tooltip="Approve"
                      icon={Check}
                      variant="default"
                      size="icon-sm"
                      onClick={() => onApprove(user.username)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </SectionCard>
  );
}
