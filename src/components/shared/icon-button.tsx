// No "use client": works from server parents (icon + href) and client parents (onClick).
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface IconButtonProps {
  /** The aria-label; also the tooltip unless `tooltip` is set. */
  label: string;
  /** Shorter visible tooltip text, e.g. "Download PDF" for "Download results as PDF". */
  tooltip?: string;
  icon: LucideIcon;
  variant?: "ghost" | "outline" | "default" | "secondary";
  /** "icon" = 40 px, "icon-sm" = 32 px (inside tables). */
  size?: "icon" | "icon-sm";
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function IconButton({ label, tooltip, icon: Icon, variant = "ghost", size = "icon", onClick, href, className }: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {href ? (
          <Button asChild variant={variant} size={size} className={className}>
            <Link href={href} aria-label={label}>
              <Icon aria-hidden />
            </Link>
          </Button>
        ) : (
          <Button variant={variant} size={size} className={className} aria-label={label} onClick={onClick}>
            <Icon aria-hidden />
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent>{tooltip ?? label}</TooltipContent>
    </Tooltip>
  );
}
