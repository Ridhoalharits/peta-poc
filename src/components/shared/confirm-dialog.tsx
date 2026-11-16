"use client";

import { TriangleAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** destructive = Delete, Deactivate, Reject; default = Reactivate. */
  tone?: "destructive" | "default";
  onConfirm: () => void;
}

/** DESIGN-SYSTEM §11.3. Radix focuses Cancel first; Esc and Cancel close without confirming. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "destructive",
  onConfirm,
}: ConfirmDialogProps) {
  const destructive = tone === "destructive";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="gap-6 p-6 sm:max-w-[440px]">
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              destructive ? "bg-destructive-soft text-destructive" : "bg-primary-soft text-primary",
            )}
          >
            <TriangleAlert className="size-5" aria-hidden />
          </span>
          <div className="flex flex-col gap-1.5">
            <AlertDialogTitle className="font-heading text-lg font-semibold">{title}</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction variant={destructive ? "destructive" : "default"} onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
