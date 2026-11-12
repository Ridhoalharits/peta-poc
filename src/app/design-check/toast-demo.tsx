"use client";

import { Button } from "@/components/ui/button";
import { toastInfo, toastSuccess } from "@/lib/toast";

export function ToastDemo() {
  return (
    <div className="flex gap-3">
      <Button variant="outline" onClick={() => toastSuccess("Draft saved", "Production Planner was saved as a draft.")}>
        Success toast
      </Button>
      <Button variant="outline" onClick={() => toastInfo("Sign out isn't available in this preview")}>
        Info toast
      </Button>
    </div>
  );
}
