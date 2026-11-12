import { Clock, Download, Pencil, SearchX, Trash2, UserSearch, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, type EmptyStateTone } from "@/components/shared/empty-state";
import { FormAlert } from "@/components/shared/form-alert";
import { IconButton } from "@/components/shared/icon-button";
import { InfoNote } from "@/components/shared/info-note";
import { RankCircle } from "@/components/shared/rank-circle";
import { ScoreBar } from "@/components/shared/score-bar";
import { SectionCard } from "@/components/shared/section-card";
import { Spinner } from "@/components/shared/spinner";
import { StatusBadge } from "@/components/shared/status-badge";
import { ToneBadge } from "@/components/shared/tone-badge";
import type { SearchStatus } from "@/lib/types";
import { ToastDemo } from "./toast-demo";

const STATUSES: SearchStatus[] = ["draft", "searching", "completed", "failed"];
const EMPTY_STATE_TONES: { tone: EmptyStateTone; icon: typeof Clock; title: string }[] = [
  { tone: "brand", icon: UserSearch, title: "No candidate searches yet" },
  { tone: "neutral", icon: SearchX, title: "No candidate searches found" },
  { tone: "danger", icon: XCircle, title: "The search failed" },
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
      <Row label="Status badges">
        {STATUSES.map((status) => <StatusBadge key={status} status={status} />)}
      </Row>
      <Row label="Tone badges">
        <ToneBadge tone="success">Ready</ToneBadge>
        <ToneBadge tone="warning">10% left to assign</ToneBadge>
        <ToneBadge tone="destructive">5% over the limit</ToneBadge>
        <ToneBadge tone="neutral" icon={Pencil}>Neutral</ToneBadge>
      </Row>
      <Row label="Icon buttons (hover for tooltip)">
        <IconButton label="Edit criteria" icon={Pencil} variant="outline" />
        <IconButton label="Download" icon={Download} />
        <IconButton label="Delete" icon={Trash2} size="icon-sm" />
      </Row>
      <Row label="Score bars, rank circles, spinner">
        <ScoreBar score={92} className="w-40" />
        <ScoreBar score={58} className="w-40" />
        <RankCircle rank={1} />
        <RankCircle rank={4} />
        <Spinner />
        <Spinner size="sm" />
      </Row>
      <Row label="Toasts">
        <ToastDemo />
      </Row>
      <div className="grid grid-cols-2 items-start gap-6">
        <FormAlert title="The search can't start yet">Fill in Job Title and Job Description.</FormAlert>
        <InfoNote>Results are ranked by how closely each employee matches your criteria.</InfoNote>
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
