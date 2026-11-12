"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ToolbarSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
}

export function ToolbarSearch({ value, onChange, placeholder, ariaLabel }: ToolbarSearchProps) {
  return (
    <div className="relative w-full max-w-[320px]">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="pl-9 [&::-webkit-search-cancel-button]:appearance-none"
      />
    </div>
  );
}

export interface ToolbarSelectOption {
  value: string;
  label: string;
}

interface ToolbarSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: ToolbarSelectOption[];
  ariaLabel: string;
  /** Trigger width in px (200 for levels, 180 for statuses in TR-01). */
  width: number;
}

export function ToolbarSelect({ value, onChange, options, ariaLabel, width }: ToolbarSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={ariaLabel} style={{ width }}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ClearFiltersButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" onClick={onClick}>
      Clear filters
      <X aria-hidden />
    </Button>
  );
}
