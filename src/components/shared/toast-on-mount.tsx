"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toastSuccess } from "@/lib/toast";

interface ToastOnMountProps {
  title: string;
  description?: string;
  /** Query params removed from the URL after the toast shows. The other params stay. */
  clear?: string[];
}

const DEFAULT_CLEAR = ["toast"];

/** Fires one success toast for a ?toast= demo switch, then removes the switch from the URL. */
export function ToastOnMount({ title, description, clear = DEFAULT_CLEAR }: ToastOnMountProps) {
  const router = useRouter();
  const pathname = usePathname();
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current) return;
    shownRef.current = true;
    toastSuccess(title, description);
    // Read from window so this component needs no Suspense boundary for useSearchParams.
    const params = new URLSearchParams(window.location.search);
    for (const key of clear) params.delete(key);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [title, description, clear, pathname, router]);

  return null;
}
