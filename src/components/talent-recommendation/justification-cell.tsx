"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Justification clamped to 2 lines, with its own Show more / Show less toggle. */
export function JustificationCell({ id, text }: { id: string; text: string }) {
  const [expanded, setExpanded] = useState(false);
  const textId = `${id}-justification`;

  return (
    <div className="flex flex-col items-start gap-1">
      <p id={textId} className={cn("text-[13px] leading-5 text-zinc-700", !expanded && "line-clamp-2")}>
        {text}
      </p>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={textId}
        onClick={() => setExpanded((current) => !current)}
        className="rounded-sm text-[13px] font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}
