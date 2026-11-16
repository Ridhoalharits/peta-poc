/** Every dialog the talent list can open. The same names are the ?open= demo values. */
export const TALENT_DIALOGS = ["filter", "columns", "add", "add-errors", "import", "import-review", "import-result", "delete"] as const;
export type TalentDialog = (typeof TALENT_DIALOGS)[number];
