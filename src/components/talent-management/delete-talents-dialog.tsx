"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { talentCount } from "./talent-count";

interface DeleteTalentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  onConfirm: () => void;
}

export function DeleteTalentsDialog({ open, onOpenChange, count, onConfirm }: DeleteTalentsDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete talents?"
      message={`${talentCount(count)} will be permanently removed from PETA. This can't be undone.`}
      confirmLabel="Delete"
      onConfirm={onConfirm}
    />
  );
}
