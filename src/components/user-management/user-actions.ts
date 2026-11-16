import type { PetaUser } from "@/lib/data/user-management";

/** What a row or request can do. All of them change the session's users, nothing is saved. */
export type UserAction = "deactivate" | "reactivate" | "approve" | "reject";
/** The actions that ask first. Approve doesn't. */
export type ConfirmKind = Exclude<UserAction, "approve">;

export const CONFIRM_COPY: Record<
  ConfirmKind,
  { title: string; message: (username: string) => string; confirmLabel: string; tone: "destructive" | "default" }
> = {
  deactivate: {
    title: "Deactivate user?",
    message: (username) => `${username} will lose access to PETA immediately and won't be able to sign in.`,
    confirmLabel: "Deactivate",
    tone: "destructive",
  },
  reactivate: {
    title: "Reactivate user?",
    message: (username) => `${username} will be able to sign in to PETA again with their current role.`,
    confirmLabel: "Reactivate",
    tone: "default",
  },
  reject: {
    title: "Reject request?",
    message: (username) => `${username}'s activation request will be removed. They won't be able to sign in to PETA.`,
    confirmLabel: "Reject",
    tone: "destructive",
  },
};

export const ACTION_TOAST: Record<UserAction, { title: string; description: (username: string) => string }> = {
  deactivate: { title: "User deactivated", description: (username) => `${username} can no longer sign in to PETA.` },
  reactivate: { title: "User reactivated", description: (username) => `${username} can sign in to PETA again.` },
  approve: { title: "Request approved", description: (username) => `${username} can now sign in to PETA.` },
  reject: { title: "Request rejected", description: (username) => `${username}'s request was removed.` },
};

/** The users after an action: deactivate / reactivate / approve change the status, reject removes the request. */
export function applyUserAction(users: PetaUser[], action: UserAction, username: string): PetaUser[] {
  if (action === "reject") return users.filter((user) => user.username !== username);
  return users.map((user) => {
    if (user.username !== username) return user;
    return action === "deactivate"
      ? { ...user, status: "Deactivated" }
      : { ...user, status: "Active", requestedOn: undefined };
  });
}

// ── Demo params (applied once, to the starting users) ───────────────────────

/** Who each ?open= demo is about. */
export const DEMO_USER = {
  menu: "andi.pratama",
  deactivate: "andi.pratama",
  reactivate: "gita.nugroho",
  reject: "nadia.wijaya",
} as const;

/** ?toast=… : the action that already happened, and to whom. */
export const DEMO_TOAST: Record<string, { action: UserAction; username: string }> = {
  deactivated: { action: "deactivate", username: "andi.pratama" },
  reactivated: { action: "reactivate", username: "gita.nugroho" },
  approved: { action: "approve", username: "budi.santoso" },
  rejected: { action: "reject", username: "nadia.wijaya" },
};

/** Starting users for the demo params: a ?toast= action already applied, or ?state=no-requests. */
export function demoStartingUsers(users: PetaUser[], toast?: string, state?: string): PetaUser[] {
  const done = toast ? DEMO_TOAST[toast] : undefined;
  const afterToast = done ? applyUserAction(users, done.action, done.username) : users;
  return state === "no-requests" ? afterToast.filter((user) => user.status !== "Pending Request") : afterToast;
}
