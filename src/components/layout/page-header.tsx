import { Fragment } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

/** The 72 px bar at the top of every page. The last breadcrumb item is the current page. */
export function PageHeader({ items }: { items: BreadcrumbEntry[] }) {
  const lastIndex = items.length - 1;

  return (
    <header className="flex h-[72px] shrink-0 items-center border-b px-10">
      <Breadcrumb>
        <BreadcrumbList className="text-sm text-muted-foreground">
          {items.map((item, index) => (
            <Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem>
                {index === lastIndex || !item.href ? (
                  <BreadcrumbPage className="font-medium text-foreground">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < lastIndex && (
                <BreadcrumbSeparator>
                  <ChevronRight className="size-3.5" />
                </BreadcrumbSeparator>
              )}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
