"use client";

import Link from "next/link";
import { Download, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/shared/icon-button";
import { toastInfo } from "@/lib/toast";

/** Found-view header actions: Download PDF (not in this preview) and Edit Criteria. */
export function ResultsActions({ searchId }: { searchId: string }) {
  return (
    <>
      <IconButton
        label="Download results as PDF"
        tooltip="Download PDF"
        icon={Download}
        variant="outline"
        onClick={() => toastInfo("PDF export isn't available in this preview")}
      />
      <Button asChild variant="outline">
        <Link href={`/talent-recommendation/${searchId}/edit`}>
          <Pencil aria-hidden />
          Edit Criteria
        </Link>
      </Button>
    </>
  );
}
