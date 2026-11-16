// Talent Management's only data entry point. Pages and components import from here, never from src/mocks/.
// In the data phase these functions become API calls.
import { TALENTS, type Talent } from "@/mocks/talent-management";

export {
  IMPORT_FILE,
  IMPORT_SKIPPED,
  JOB_FAMILIES,
  MARITAL_STATUSES,
  RELIGIONS,
  TALENT_COLUMNS,
  TALENT_EMPLOYEE_TYPES,
  WORK_SPACES,
} from "@/mocks/talent-management";
export type {
  ImportSkippedRow,
  Talent,
  TalentColumn,
  TalentColumnKey,
  TalentEmployeeType,
  WorkSpace,
} from "@/mocks/talent-management";

export function listTalents(): Talent[] {
  return [...TALENTS];
}

export function getTalent(id: string): Talent | undefined {
  return TALENTS.find((talent) => talent.id === id);
}
