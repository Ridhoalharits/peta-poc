"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { Talent } from "@/lib/data/talent-management";
import { ageOn, monthsBetween } from "@/lib/format";
import { toastSuccess } from "@/lib/toast";
import { TalentDetailCards, TalentSummary } from "./talent-details";
import { talentToFormValues, type TalentFormValues } from "./talent-form";
import { TalentFormDialog } from "./talent-form-dialog";

export type ProfileDialog = "edit" | "delete";

/** The saved form values as a Talent, with age and length of service recalculated from the dates. */
function applyEdit(talent: Talent, values: TalentFormValues): Talent {
  return {
    ...talent,
    ...(values as Partial<Talent>),
    age: ageOn(values.dob),
    lengthOfServiceMonths: monthsBetween(values.hireDate),
  };
}

interface TalentProfileProps {
  initialTalent: Talent;
  /** Demo: ?open=edit or ?open=delete. */
  initialDialog?: ProfileDialog;
}

/** TM-09 / TM-10. Edits live in this component's state for the session. */
export function TalentProfile({ initialTalent, initialDialog }: TalentProfileProps) {
  const router = useRouter();
  const [talent, setTalent] = useState(initialTalent);
  const [openDialog, setOpenDialog] = useState<ProfileDialog | null>(initialDialog ?? null);
  const setOpen = (dialog: ProfileDialog) => (open: boolean) => setOpenDialog(open ? dialog : null);

  const saveEdit = (values: TalentFormValues) => {
    const updated = applyEdit(talent, values);
    setTalent(updated);
    toastSuccess("Changes saved", `${updated.fullName}'s details were updated.`);
  };
  // The list hides this talent and shows the "1 talent was removed" toast (TM03).
  const deleteTalent = () => router.push(`/talent-management?toast=deleted&hide=${talent.id}`);

  return (
    <>
      <TalentSummary
        talent={talent}
        actions={
          <>
            <Button
              variant="outline"
              className="border-destructive-border text-destructive-text hover:bg-destructive-soft hover:text-destructive-text"
              onClick={() => setOpenDialog("delete")}
            >
              <Trash2 aria-hidden />
              Delete
            </Button>
            <Button onClick={() => setOpenDialog("edit")}>
              <Pencil aria-hidden />
              Edit
            </Button>
          </>
        }
      />
      <TalentDetailCards talent={talent} />
      <TalentFormDialog
        key={`edit-${openDialog === "edit"}`}
        mode="edit"
        open={openDialog === "edit"}
        onOpenChange={setOpen("edit")}
        initial={talentToFormValues(talent)}
        onSaved={saveEdit}
      />
      <ConfirmDialog
        open={openDialog === "delete"}
        onOpenChange={setOpen("delete")}
        title="Delete talent?"
        message={`${talent.fullName} will be permanently removed from PETA. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={deleteTalent}
      />
    </>
  );
}
