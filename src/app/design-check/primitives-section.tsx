import { Ban, Check, Clock, Download, Pencil, SearchX, Trash2, TriangleAlert, UserSearch, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, type EmptyStateTone } from "@/components/shared/empty-state";
import { FormAlert } from "@/components/shared/form-alert";
import { IconButton } from "@/components/shared/icon-button";
import { SectionCard } from "@/components/shared/section-card";
import { SolidBadge } from "@/components/shared/solid-badge";
import { ToastDemo } from "./toast-demo";

const EMPTY_STATE_TONES: { tone: EmptyStateTone; icon: typeof Clock; title: string }[] = [
  { tone: "brand", icon: UserSearch, title: "No candidate searches yet" },
  { tone: "neutral", icon: SearchX, title: "No candidate searches found" },
  { tone: "danger", icon: TriangleAlert, title: "The search failed" },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export function PrimitivesSection() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-heading text-lg font-semibold">Feedback and page primitives</h2>
      <Row label="Solid badges">
        <SolidBadge tone="primary">Primary</SolidBadge>
        <SolidBadge tone="warning">Warning</SolidBadge>
        <SolidBadge tone="destructive">Destructive</SolidBadge>
        <SolidBadge tone="neutral">Neutral</SolidBadge>
      </Row>
      <Row label="With an icon or a dot">
        <SolidBadge tone="primary" icon={Check}>Completed</SolidBadge>
        <SolidBadge tone="warning" icon={Clock}>Pending Request</SolidBadge>
        <SolidBadge tone="destructive" icon={X}>Failed</SolidBadge>
        <SolidBadge tone="neutral" icon={Ban}>Deactivated</SolidBadge>
        <SolidBadge tone="primary" dot>Active</SolidBadge>
      </Row>
      <Row label="Icon buttons (hover for tooltip)">
        <IconButton label="Edit criteria" icon={Pencil} variant="outline" />
        <IconButton label="Download" icon={Download} />
        <IconButton label="Delete" icon={Trash2} size="icon-sm" />
      </Row>
      <Row label="Toasts">
        <ToastDemo />
      </Row>
      <div className="grid grid-cols-2 items-start gap-6">
        <FormAlert title="The search can't start yet">Add the job title and job description.</FormAlert>
        <FormAlert>Fix the highlighted fields to continue.</FormAlert>
      </div>
      <SectionCard title="Section card" description="Card with a header, body and footer." footer={<Button>Save</Button>}>
        <p className="text-sm">Card body</p>
      </SectionCard>
      <div className="grid grid-cols-3 gap-6">
        {EMPTY_STATE_TONES.map(({ tone, icon, title }) => (
          <EmptyState
            key={`page-${tone}`}
            variant="page"
            tone={tone}
            icon={icon}
            title={title}
            description={`Page-level empty state, ${tone} tone.`}
            action={<Button variant="outline">Action</Button>}
          />
        ))}
      </div>
      <SectionCard contentClassName="p-0 gap-0">
        <div className="grid grid-cols-3">
          {EMPTY_STATE_TONES.map(({ tone, icon, title }) => (
            <EmptyState
              key={`inline-${tone}`}
              variant="inline"
              tone={tone}
              icon={icon}
              title={title}
              description={`Inline empty state, ${tone} tone.`}
              action={<Button variant="outline">Clear filters</Button>}
            />
          ))}
        </div>
      </SectionCard>
    </section>
  );
}
