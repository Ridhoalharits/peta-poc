import { Ban, Clock } from "lucide-react";
import { SolidBadge } from "@/components/shared/solid-badge";
import type { UserStatus } from "@/lib/data/user-management";

/** DESIGN-SYSTEM §11.1: Active = primary + white dot, Pending Request = warning + Clock, Deactivated = neutral + Ban. */
export function UserStatusBadge({ status }: { status: UserStatus }) {
  if (status === "Active") {
    return (
      <SolidBadge tone="primary" dot>
        Active
      </SolidBadge>
    );
  }
  if (status === "Pending Request") {
    return (
      <SolidBadge tone="warning" icon={Clock}>
        Pending Request
      </SolidBadge>
    );
  }
  return (
    <SolidBadge tone="neutral" icon={Ban}>
      Deactivated
    </SolidBadge>
  );
}
