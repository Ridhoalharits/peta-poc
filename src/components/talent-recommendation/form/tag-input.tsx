"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  id: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

export function TagInput({ id, tags, onChange, placeholder = "Add major…", disabled = false, ...aria }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const addDraft = () => {
    const tag = draft.trim();
    if (tag && !tags.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      onChange([...tags, tag]);
    }
    setDraft("");
  };

  return (
    <div
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2 py-1.5 shadow-xs transition-[color,box-shadow]",
        "focus-within:border-primary focus-within:ring-[3px] focus-within:ring-brand-light/35",
        aria["aria-invalid"] && "border-destructive ring-[3px] ring-destructive/15",
        disabled && "cursor-not-allowed bg-muted",
      )}
    >
      {tags.map((tag) => (
        <span key={tag} className="inline-flex h-6 items-center gap-1 rounded-md bg-muted px-2 text-xs font-medium">
          {tag}
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(tags.filter((existing) => existing !== tag))}
            aria-label={`Remove ${tag}`}
            className="rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
          >
            <X className="size-3" aria-hidden />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            addDraft();
          }
        }}
        onBlur={addDraft}
        className="h-6 min-w-24 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        {...aria}
      />
    </div>
  );
}
