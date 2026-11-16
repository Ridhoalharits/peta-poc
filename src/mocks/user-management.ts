export type UserStatus = "Active" | "Pending Request" | "Deactivated";
export type UserRole = "Admin" | "HR Manager" | "HR Staff";

export interface PetaUser {
  id: number;
  username: string;
  role: UserRole;
  status: UserStatus;
  requestedOn?: string; // ISO date, pending requests only
}

/** In table order (the tables don't sort). budi.santoso is also the pending sign-in account. */
export const USERS: readonly PetaUser[] = [
  { id: 1, username: "peta.admin", role: "Admin", status: "Active" },
  { id: 2, username: "andi.pratama", role: "HR Manager", status: "Active" },
  { id: 3, username: "citra.wijaya", role: "HR Staff", status: "Active" },
  { id: 4, username: "hendra.kurniawan", role: "HR Staff", status: "Active" },
  { id: 5, username: "maya.hidayat", role: "HR Manager", status: "Active" },
  { id: 6, username: "budi.santoso", role: "HR Staff", status: "Pending Request", requestedOn: "2026-11-09" },
  { id: 7, username: "dewi.lestari", role: "HR Staff", status: "Active" },
  { id: 8, username: "fajar.saputra", role: "HR Manager", status: "Pending Request", requestedOn: "2026-11-08" },
  { id: 9, username: "gita.nugroho", role: "HR Staff", status: "Deactivated" },
  { id: 10, username: "indah.siregar", role: "HR Staff", status: "Active" },
  { id: 11, username: "lukman.hidayat", role: "Admin", status: "Deactivated" },
  { id: 12, username: "nadia.wijaya", role: "HR Staff", status: "Pending Request", requestedOn: "2026-11-06" },
];
