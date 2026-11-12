import type { Metadata } from "next";
import { CircleAlert, Loader2, MoreVertical, Plus, SlidersHorizontal, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PrimitivesSection } from "./primitives-section";
import { TableDemo } from "./table-demo";
import { FormDemo } from "./form-demo";

// Review page for the design tokens and shared components (compare with docs/design-system/foundations.png).
// Not linked from the app; kept for design review and excluded from search engines.
export const metadata: Metadata = {
  title: "Design check · PETA",
  robots: { index: false },
};

// Static copy of the Input focus styles, so the focus state is visible without clicking.
const FOCUS_DEMO_CLASSES = "border-primary ring-[3px] ring-brand-light/35";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function ButtonsSection() {
  return (
    <Section title="Button">
      <div className="flex flex-wrap items-center gap-3">
        <Button><Plus />Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline"><Upload />Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive"><Trash2 />Destructive</Button>
        <Button variant="link">Link</Button>
        <Button variant="outline" size="icon" aria-label="Filter"><SlidersHorizontal /></Button>
        <Button variant="ghost" size="icon-sm" aria-label="More actions"><MoreVertical /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button>Default size</Button>
        <Button size="lg">Large</Button>
        <Button disabled>Start Search</Button>
        <Button disabled><Loader2 className="animate-spin" />Starting...</Button>
        <Button className="ring-[3px] ring-ring">Focus demo</Button>
      </div>
    </Section>
  );
}

function InputsSection() {
  return (
    <Section title="Form controls">
      <div className="grid grid-cols-4 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="dc-default">Job Title <span className="text-destructive">*</span></Label>
          <Input id="dc-default" placeholder="e.g. Accounting Officer" />
          <p className="text-xs text-muted-foreground">Default</p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="dc-focus">Job Title <span className="text-destructive">*</span></Label>
          <Input id="dc-focus" defaultValue="Accounting Officer" className={FOCUS_DEMO_CLASSES} />
          <p className="text-xs text-muted-foreground">Focus</p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="dc-error" className="text-destructive-text">Job Title <span className="text-destructive">*</span></Label>
          <Input id="dc-error" aria-invalid aria-describedby="dc-error-msg" />
          <p id="dc-error-msg" className="flex items-center gap-1 text-xs font-medium text-destructive-text">
            <CircleAlert className="size-3.5" />Enter a job title.
          </p>
        </div>
        <div className="flex flex-col gap-2 opacity-50">
          <Label htmlFor="dc-disabled">Min. GPA</Label>
          <Input id="dc-disabled" defaultValue="3.00" disabled />
          <p className="text-xs text-muted-foreground">Disabled (requirement unchecked)</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="dc-select">Management Level</Label>
          <Select defaultValue="officer">
            <SelectTrigger id="dc-select" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="officer">Officer</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          <Label htmlFor="dc-textarea">Job Description <span className="text-destructive">*</span></Label>
          <Textarea id="dc-textarea" placeholder="Describe the purpose of this role..." />
        </div>
      </div>
      <div className="flex gap-16">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2"><Checkbox id="dc-cb1" defaultChecked /><Label htmlFor="dc-cb1">Education Level</Label></div>
          <div className="flex items-center gap-2"><Checkbox id="dc-cb2" /><Label htmlFor="dc-cb2">Accept related majors</Label></div>
          <div className="flex items-center gap-2"><Checkbox id="dc-cb3" disabled /><Label htmlFor="dc-cb3">Disabled</Label></div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2"><Switch id="dc-sw1" defaultChecked /><Label htmlFor="dc-sw1">Advanced mode</Label></div>
          <div className="flex items-center gap-2"><Switch id="dc-sw2" /><Label htmlFor="dc-sw2">Off</Label></div>
        </div>
      </div>
    </Section>
  );
}

function TypographySection() {
  return (
    <Section title="Typography">
      <div className="flex flex-col gap-3">
        <p className="font-heading text-2xl font-semibold tracking-tight">Page title</p>
        <p className="font-heading text-lg font-semibold">Section / dialog title</p>
        <p className="font-heading text-base font-semibold">Card title</p>
        <p className="text-sm">Body text for forms and content</p>
        <p className="text-sm font-medium">Label and button</p>
        <p className="text-[13px] leading-[18px]">Table cell text</p>
        <p className="text-xs text-muted-foreground">Caption, helper and group label</p>
      </div>
    </Section>
  );
}

export default function DesignCheckPage() {
  return (
    <main className="flex flex-col gap-10 px-10 pt-8 pb-10">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Design check</h1>
      <TypographySection />
      <ButtonsSection />
      <InputsSection />
      <PrimitivesSection />
      <Section title="Data table">
        <TableDemo />
      </Section>
      <Section title="Form building blocks">
        <FormDemo />
      </Section>
    </main>
  );
}
