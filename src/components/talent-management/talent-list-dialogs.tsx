"use client";

import type { TalentColumnKey } from "@/lib/data/talent-management";
import { toastSuccess } from "@/lib/toast";
import { BulkImportDialog, type ImportStep } from "./bulk-import-dialog";
import { DeleteTalentsDialog } from "./delete-talents-dialog";
import { FilterDialog } from "./filter-dialog";
import type { TalentFilters } from "./talent-filters";
import { TalentFormDialog } from "./talent-form-dialog";
import { ViewSettingsDialog } from "./view-settings-dialog";

/** ?open=import-review / import-result start the import at a later step. */
const IMPORT_DEMO_STEP: Partial<Record<TalentDialog, ImportStep>> = {
  "import-review": "review",
  "import-result": "result",
};

import type { TalentDialog } from "./talent-dialogs";

interface TalentListDialogsProps {
  open: TalentDialog | null;
  onOpenChange: (dialog: TalentDialog | null) => void;
  filters: TalentFilters;
  onApplyFilters: (filters: TalentFilters) => void;
  visibleColumns: TalentColumnKey[];
  onApplyColumns: (columns: TalentColumnKey[]) => void;
  selectedCount: number;
  onConfirmDelete: () => void;
}

/** Each dialog remounts (key) when it opens, so it always starts from the current state. */
export function TalentListDialogs({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  visibleColumns,
  onApplyColumns,
  selectedCount,
  onConfirmDelete,
}: TalentListDialogsProps) {
  const isOpen = (...dialogs: TalentDialog[]) => open !== null && dialogs.includes(open);
  const setOpen = (dialog: TalentDialog) => (value: boolean) => onOpenChange(value ? dialog : null);

  return (
    <>
      <FilterDialog key={`filter-${isOpen("filter")}`} open={isOpen("filter")} onOpenChange={setOpen("filter")} filters={filters} onApply={onApplyFilters} />
      <ViewSettingsDialog
        key={`columns-${isOpen("columns")}`}
        open={isOpen("columns")}
        onOpenChange={setOpen("columns")}
        visibleColumns={visibleColumns}
        onApply={onApplyColumns}
      />
      <DeleteTalentsDialog open={isOpen("delete") && selectedCount > 0} onOpenChange={setOpen("delete")} count={selectedCount} onConfirm={onConfirmDelete} />
      <TalentFormDialog
        key={`add-${isOpen("add", "add-errors")}`}
        mode="add"
        open={isOpen("add", "add-errors")}
        onOpenChange={setOpen("add")}
        showErrors={open === "add-errors"}
        onSaved={(values) => toastSuccess("Talent added", `${values.fullName} was added to PETA.`)}
      />
      <BulkImportDialog
        key={`import-${isOpen("import", "import-review", "import-result")}`}
        open={isOpen("import", "import-review", "import-result")}
        onOpenChange={setOpen("import")}
        initialStep={IMPORT_DEMO_STEP[open ?? "import"] ?? "upload"}
      />
    </>
  );
}
