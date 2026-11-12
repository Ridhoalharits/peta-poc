"use client"

import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

// PETA toast (DESIGN-SYSTEM §6.10): light only, 360 px, rounded-xl, shadow-lg, ghost ✕ on the right.
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      closeButton
      icons={{
        success: <CircleCheckIcon className="size-[18px] text-primary" />,
        info: <InfoIcon className="size-[18px] text-muted-foreground" />,
        warning: <TriangleAlertIcon className="size-[18px] text-warning" />,
        error: <CircleAlertIcon className="size-[18px] text-destructive" />,
        loading: <Loader2Icon className="size-[18px] animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "items-start! gap-3! rounded-xl! border! border-border! bg-white! p-4! pr-10! shadow-lg! text-foreground!",
          icon: "m-0! size-[18px]! mt-px!",
          title: "text-sm! font-semibold!",
          description: "text-[13px]! text-muted-foreground!",
          closeButton:
            "left-auto! right-3! top-3! transform-none! size-6! rounded-md! border-0! bg-transparent! text-muted-foreground! hover:bg-accent! hover:text-foreground!",
        },
      }}
      style={
        {
          "--width": "360px",
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "calc(var(--radius) + 4px)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
