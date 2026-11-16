// User Management's only data entry point. Pages and components import from here, never from src/mocks/.
// In the data phase this becomes an API call.
import { USERS, type PetaUser } from "@/mocks/user-management";

export type { PetaUser, UserRole, UserStatus } from "@/mocks/user-management";

export function listUsers(): PetaUser[] {
  return USERS.map((user) => ({ ...user }));
}
