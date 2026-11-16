"use client";

import { useState } from "react";
import { ChevronLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/form-dialog";
import { IMPORT_FILE } from "@/lib/data/talent-management";
import { toastSuccess } from "@/lib/toast";
import { ImportStepper, ResultStep, ReviewStep, UploadStep } from "./bulk-import-steps";
import { importedToastDescription } from "./talent-count";

export type ImportStep = "upload" | "review" | "result";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Demo: ?open=import-review / import-result. The list remounts the dialog (key) on every opening. */
  initialStep?: ImportStep;
}

/** TM-07 / TM-08 / TM-08a. A simulated import: no file is read and the table doesn't change. */
export function BulkImportDialog({ open, onOpenChange, initialStep = "upload" }: BulkImportDialogProps) {
  const [step, setStep] = useState<ImportStep>(initialStep);
  const close = () => onOpenChange(false);
  const finish = () => {
    close();
    toastSuccess("Import finished", importedToastDescription());
  };
  const isResult = step === "result";

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isResult ? "Import finished" : "Bulk Import Talents"}
      description={isResult ? IMPORT_FILE.name : "Add many talents at once from a spreadsheet."}
      width={640}
      footerStart={
        step === "review" && (
          <Button variant="ghost" onClick={() => setStep("upload")}>
            <ChevronLeft aria-hidden />
            Back
          </Button>
        )
      }
      footer={
        isResult ? (
          <Button onClick={finish}>Done</Button>
        ) : (
          <>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            {step === "upload" ? (
              <Button disabled>Continue</Button>
            ) : (
              <Button onClick={() => setStep("result")}>
                <Upload aria-hidden />
                Import Talents
              </Button>
            )}
          </>
        )
      }
    >
      {!isResult && <ImportStepper current={step === "upload" ? 0 : 1} />}
      {step === "upload" && <UploadStep onFileChosen={() => setStep("review")} />}
      {step === "review" && <ReviewStep onReplace={() => setStep("upload")} />}
      {isResult && <ResultStep />}
    </FormDialog>
  );
}
