"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// DESIGN-SYSTEM §11.2 widths. Fixed classes so Tailwind can see them.
const WIDTH_CLASSES = {
  520: "sm:max-w-[520px]",
  560: "sm:max-w-[560px]",
  600: "sm:max-w-[600px]",
  640: "sm:max-w-[640px]",
  760: "sm:max-w-[760px]",
} as const;

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  width: keyof typeof WIDTH_CLASSES;
  /** Header with a bottom border, for long forms (Add / Edit Talent). */
  divided?: boolean;
  /** Left side of the footer: a "Reset all" link or a hint. */
  footerStart?: React.ReactNode;
  /** Right side of the footer: Cancel + primary. */
  footer: React.ReactNode;
  children: React.ReactNode;
}

export function FormDialog({ open, onOpenChange, title, description, width, divided, footerStart, footer, children }: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn("flex max-h-[calc(100vh-48px)] flex-col gap-0 overflow-hidden p-0", WIDTH_CLASSES[width])}
      >
        <div className={cn("flex items-start justify-between gap-4 p-6", divided ? "border-b" : "pb-0")}>
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="font-heading text-lg leading-7 font-semibold">{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="-mt-1 -mr-2 size-8" aria-label="Close">
              <X className="size-4" aria-hidden />
            </Button>
          </DialogClose>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">{children}</div>
        <div className="flex items-center justify-between gap-3 border-t bg-[#fafafa] px-6 py-4">
          <div>{footerStart}</div>
          <div className="flex items-center gap-2">{footer}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
