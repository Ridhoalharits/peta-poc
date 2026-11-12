import { toast } from "sonner";

/** Success toast: CircleCheck in primary (icon set on the Toaster). */
export function toastSuccess(title: string, description?: string) {
  toast.success(title, { description });
}

/** Info toast for features that aren't in this preview: Info icon in muted colour. */
export function toastInfo(title: string, description?: string) {
  toast.info(title, { description });
}
