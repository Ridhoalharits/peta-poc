"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FormDialog } from "@/components/shared/form-dialog";
import { FormField } from "@/components/shared/form/form-field";
import { toastSuccess } from "@/lib/toast";

type OpenDialog = "filter" | "long" | "delete" | "reactivate" | null;
const LONG_FIELD_COUNT = 14;

/** F10 review: the two dialog shells in the four ways the modules use them. */
export function DialogDemo() {
  const [open, setOpen] = useState<OpenDialog>(null);
  const openChange = (dialog: OpenDialog) => (isOpen: boolean) => setOpen(isOpen ? dialog : null);
  const close = () => setOpen(null);

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => setOpen("filter")}>560 px form dialog</Button>
      <Button variant="outline" onClick={() => setOpen("long")}>760 px divided dialog</Button>
      <Button variant="outline" onClick={() => setOpen("delete")}>Destructive confirm</Button>
      <Button variant="outline" onClick={() => setOpen("reactivate")}>Default confirm</Button>

      <FormDialog
        open={open === "filter"}
        onOpenChange={openChange("filter")}
        title="Filter"
        description="Narrow the list down."
        width={560}
        footerStart={<Button variant="link" className="h-auto px-0">Reset all</Button>}
        footer={
          <>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={close}>Apply filters</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Position" htmlFor="dd-position"><Input id="dd-position" /></FormField>
          <FormField label="Location" htmlFor="dd-location"><Input id="dd-location" /></FormField>
        </div>
      </FormDialog>

      <FormDialog
        open={open === "long"}
        onOpenChange={openChange("long")}
        title="Add Talent"
        description="Fill in the talent's details."
        width={760}
        divided
        footerStart={<span className="text-[13px] text-muted-foreground">Fields marked * are required.</span>}
        footer={
          <>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={close}>Save</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: LONG_FIELD_COUNT }, (_, index) => (
            <FormField key={index} label={`Field ${index + 1}`} htmlFor={`dd-field-${index}`}>
              <Input id={`dd-field-${index}`} />
            </FormField>
          ))}
        </div>
      </FormDialog>

      <ConfirmDialog
        open={open === "delete"}
        onOpenChange={openChange("delete")}
        title="Delete talents?"
        message="3 talents will be removed. This can't be undone."
        confirmLabel="Delete"
        onConfirm={() => toastSuccess("Talents deleted")}
      />
      <ConfirmDialog
        open={open === "reactivate"}
        onOpenChange={openChange("reactivate")}
        title="Reactivate user?"
        message="The user can sign in again."
        confirmLabel="Reactivate"
        tone="default"
        onConfirm={() => toastSuccess("User reactivated")}
      />
    </div>
  );
}
