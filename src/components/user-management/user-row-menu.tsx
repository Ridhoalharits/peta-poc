"use client";

import { ArrowRight, Ban, EllipsisVertical, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { PetaUser } from "@/lib/data/user-management";

export type RowMenuChoice = "deactivate" | "reactivate" | "requests";

const ITEM_CLASSES = "h-9 gap-2 rounded-md px-2 text-sm";

interface UserRowMenuProps {
  user: PetaUser;
  /** Demo: ?open=menu opens andi.pratama's menu. */
  defaultOpen?: boolean;
  onChoose: (choice: RowMenuChoice) => void;
}

/** DESIGN-SYSTEM §11.4. One item, depending on the user's status. */
export function UserRowMenu({ user, defaultOpen, onChoose }: UserRowMenuProps) {
  return (
    // Non-modal, so a confirm dialog can open straight from an item without the menu's focus trap in the way.
    <DropdownMenu defaultOpen={defaultOpen} modal={false}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`More actions for ${user.username}`}>
              <EllipsisVertical aria-hidden />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>More actions</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-56 rounded-lg p-1 shadow-lg">
        {user.status === "Active" && (
          <DropdownMenuItem
            className={`${ITEM_CLASSES} text-destructive-text focus:bg-destructive-soft focus:text-destructive-text [&_svg]:text-destructive-text!`}
            onSelect={() => onChoose("deactivate")}
          >
            <Ban aria-hidden />
            Deactivate account
          </DropdownMenuItem>
        )}
        {user.status === "Deactivated" && (
          <DropdownMenuItem className={ITEM_CLASSES} onSelect={() => onChoose("reactivate")}>
            <RotateCcw aria-hidden />
            Reactivate account
          </DropdownMenuItem>
        )}
        {user.status === "Pending Request" && (
          <DropdownMenuItem className={ITEM_CLASSES} onSelect={() => onChoose("requests")}>
            <ArrowRight aria-hidden />
            Go to activation request
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
