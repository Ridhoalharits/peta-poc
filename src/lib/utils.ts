// The shadcn registry now ships `cn` as an npm package (a drop-in for clsx + tailwind-merge).
// Re-export it so app code can import from "@/lib/utils" as usual.
export { cn } from "cn";
