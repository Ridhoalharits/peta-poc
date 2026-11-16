"use client";

import Link from "next/link";
import { Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FormActions({ cancelHref, onSaveDraft }: { cancelHref: string; onSaveDraft: () => void }) {
  return (
    <div className="flex items-center justify-end gap-2 border-t pt-4">
      <Button asChild variant="ghost">
        <Link href={cancelHref}>Cancel</Link>
      </Button>
      <Button type="button" variant="outline" onClick={onSaveDraft}>
        <Save aria-hidden />
        Save Draft
      </Button>
      <Button type="submit">
        <Search aria-hidden />
        Start Search
      </Button>
    </div>
  );
}
